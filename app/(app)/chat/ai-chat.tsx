import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList, Keyboard,
  TouchableOpacity,
} from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

import AppBar from "@/components/app-bar/AppBar";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import MessageBubble from "@/components/message/MessageBubble";
import MessageTextInput from "@/components/message/MessageTextInput";
import i18n from "@/languages/i18n";
import {
  fetchAiConfigs,
  sendImageMessage,
  sendTextMessage,
} from "@/redux/features/ai/aiSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import {convertImageToBase64} from "@/utils/helpers/imageHelper";
import KeyboardTrackingView
  from "react-native-ui-lib/lib/components/Keyboard/KeyboardTracking/KeyboardTrackingView/KeyboardTrackingView.ios";

const AIChatScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { messages, isLoading, isThinking, error, configs } = useSelector(
      (state: RootState) => state.ai
  );
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("Đã gửi");
  const scrollRef = useRef<FlatList>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const hasValidContent = (msg: any) => {
    return (
        !msg.isSystemMessage &&
        (
            msg.parts?.[0]?.text?.trim() !== '' ||
            msg.parts?.some((part: any) => part.image)
        )
    );
  };

  const hasMessages = messages.filter(hasValidContent).length > 0;

  const { user } = useAuth();

  useEffect(() => {
    dispatch(fetchAiConfigs())
        .unwrap()
        .catch((error: any) => {
          console.error("Error fetching configs:", error);
        });
  }, [dispatch]);

  useEffect(() => {
    const sendInitialContext = async () => {
      try {
        if (!configs || configs.length === 0) return;

        const userContext = {
          user_id: user?.id || "guest",
          name: user?.full_name || "Khách",
          timestamp: new Date().toISOString(),
          is_guest: !user?.id,
        };

        await dispatch(
            sendTextMessage({
              text: JSON.stringify(userContext),
              isSystemMessage: true,
            })
        ).unwrap();
      } catch (error) {
        console.error("Failed to send user context:", error);
      }
    };

    sendInitialContext();
  }, [configs]);

  const handleSend = async () => {
    if (!message.trim() && selectedImages.length === 0) return;

    const currentMessage = message;
    setMessage("");
    setSelectedImages([]);

    try {
      setMessageStatus("Đang gửi");

      if (!configs || configs.length === 0) {
        throw new Error("Chưa tải được cấu hình AI");
      }

      if (selectedImages.length > 0) {
        try {
          const imageData = [];
          for (const uri of selectedImages) {
            const processedImage = await convertImageToBase64(uri);
            imageData.push({
              data: processedImage.base64,
              mimeType: "image/jpeg",
            });
          }

          await dispatch(
              sendImageMessage({
                text: currentMessage,
                images: imageData,
              })
          ).unwrap();
        } catch (error: any) {
          throw new Error(`Lỗi xử lý hình ảnh: ${error.message}`);
        }
      } else {
        await dispatch(
            sendTextMessage({
              text: currentMessage,
            })
        ).unwrap();
      }

      setMessageStatus("Đã gửi");
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setMessageStatus(`Lỗi: ${err.message}`);
    }
  };

  const handleRead = () => {
    if (!hasMessages) return null;

    return (
        <View row centerV right paddingH-10>
          <Text>{messageStatus}</Text>
          {messageStatus === "Đang gửi" && (
              <ActivityIndicator
                  size="small"
                  color={Colors.primary}
                  style={{ marginLeft: 5 }}
              />
          )}
        </View>
    );
  };

  const renderChatUI = () => (
      <>
        <FlatList
            data={messages.filter(hasValidContent)}
            renderItem={({ item, index }) => {
              const messageText = item.parts?.[0]?.text || "";
              const hasImages = item.parts?.some((p: any) => p.image);

              if (!messageText.trim() && !hasImages) return null;

              return (
                  <MessageBubble
                      key={`message-${item.id || index}`}
                      message={{
                        id: item.id || `msg-${index}`,
                        message: messageText,
                        sender_id: item.role === "user" ? "user" : "ai",
                        created_at: new Date().toISOString(),
                        attachments: item.parts
                            ?.filter((p: any) => p.image)
                            ?.map((p: any) => p.image.data) || [],
                      }}
                      isOwn={item.role === "user"}
                      isThinking={
                          item.role === "model" &&
                          isThinking &&
                          index === messages.length - 1
                      }
                  />
              );
            }}
            ref={scrollRef}
            onContentSizeChange={() => {
              requestAnimationFrame(() => {
                scrollRef.current?.scrollToEnd({ animated: true });
              });
            }}
            keyExtractor={(item, index) => item.id || `msg-${index}`}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 16,
              paddingBottom: 16,
            }}
            ListFooterComponent={handleRead}
        />

        {selectedImages.length > 0 && (
            <SelectImagesBar
                selectedImages={selectedImages}
                setSelectedImages={setSelectedImages}
            />
        )}

        <MessageTextInput
            placeholder={
                i18n.t("chat.chat_with") + " " + i18n.t("chat.chat_with_ai") + ".."
            }
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            isCamera={true}
            isAI={true}
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
        />
      </>
  );

  useEffect(() => {
    if (error) {
      setMessageStatus("Lỗi: " + error);
    }
  }, [error]);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    dispatch(fetchAiConfigs()).finally(() => setRefreshing(false));
  }, []);


  return (
      <KeyboardTrackingView
          style={{ flex: 1, backgroundColor: Colors.white }}
          trackInteractive
          useSafeArea
      >
        <AppBar back title={i18n.t("chat.chat_with_ai")} />
        {renderChatUI()}
      </KeyboardTrackingView>
  );
};

export default AIChatScreen;
