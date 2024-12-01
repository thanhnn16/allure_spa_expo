import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Dimensions, Keyboard } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";

import AppBar from "@/components/app-bar/AppBar";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import MessageBubble from "@/components/message/MessageBubble";
import MessageTextInput from "@/components/message/MessageTextInput";
import {
  fetchAiConfigs,
  sendImageMessage,
  sendTextMessage,
} from "@/redux/features/ai/aiSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import { convertImageToBase64 } from "@/utils/helpers/imageHelper";
import { useLanguage } from "@/hooks/useLanguage";

// Add new constant for guiding messages
const GUIDING_MESSAGES = [
  {
    id: "skin_analysis",
    messages: {
      vi: "Phân tích làn da của tôi",
      en: "Analyze my skin condition",
      ja: "私の肌状態を分析してください",
    },
    icon: "🔍",
  },
  {
    id: "treatment_recommend",
    messages: {
      vi: "Tư vấn liệu trình chăm sóc",
      en: "Recommend treatment plan",
      ja: "トリートメントプランを提案",
    },
    icon: "✨",
  },
  {
    id: "booking",
    messages: {
      vi: "Đặt lịch hẹn",
      en: "Book an appointment",
      ja: "予約を取る",
    },
    icon: "📅",
  },
  {
    id: "products",
    messages: {
      vi: "Tư vấn sản phẩm chăm sóc",
      en: "Product recommendations",
      ja: "おすすめの製品",
    },
    icon: "🛍️",
  },
];

const AIChatScreen = () => {
  const { t } = useLanguage();

  const dispatch = useDispatch<AppDispatch>();
  const { messages, isThinking, error, configs } = useSelector(
    (state: RootState) => state.ai
  );
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("Đã gửi");
  const scrollRef = useRef<FlatList>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  const { currentLanguage } = useLanguage();

  const hasValidContent = (msg: any) => {
    return (
      !msg.isSystemMessage &&
      (msg.parts?.[0]?.text?.trim() !== "" ||
        msg.parts?.some((part: any) => part.image))
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

        const activeConfig = configs.find(
          (config: any) =>
            config.type === "general_assistant" && config.is_active
        );

        if (!activeConfig) {
          throw new Error("Chưa có cấu hình AI hoạt động");
        }

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
        setMessageStatus("Lỗi: Không thể khởi tạo chat");
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

      const activeConfig = configs.find(
        (config: any) => config.type === "general_assistant" && config.is_active
      );

      if (!activeConfig) {
        throw new Error("Chưa có cấu hình AI hoạt động");
      }

      if (selectedImages.length > 0) {
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

  // Sửa hàm handleGuidingMessage
  const handleGuidingMessage = async (messageId: string) => {
    const message = GUIDING_MESSAGES.find((m) => m.id === messageId);
    if (message) {
      const guidingMessage = message.messages[currentLanguage as keyof typeof message.messages];
      try {
        await dispatch(
          sendTextMessage({
            text: guidingMessage,
          })
        ).unwrap();
        setMessageStatus("Đã gửi");
      } catch (err: any) {
        console.error("Failed to send guiding message:", err);
        setMessageStatus(`Lỗi: ${err.message}`);
      }
    }
  };

  // Add new component for empty state
  const renderEmptyState = () => {
    if (hasMessages) return null;

    return (
      <View flex center padding-16>
        <Text color={Colors.primary} text80 marginB-16 marginT-32>
          {t("chat.start_conversation")}
        </Text>
        <View style={{ width: "100%" }}>
          {GUIDING_MESSAGES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 16,
                marginVertical: 8,
                backgroundColor: Colors.grey70,
                borderRadius: 8,
              }}
              onPress={() => handleGuidingMessage(item.id)}
            >
              <Text marginR-8>{item.icon}</Text>
              <Text>
                {item.messages[currentLanguage as keyof typeof item.messages]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderChatUI = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View flex>
        {renderEmptyState()}
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
                  attachments:
                    item.parts
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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets={true}
          onScrollBeginDrag={Keyboard.dismiss}
        />

        {selectedImages.length > 0 && (
          <SelectImagesBar
            selectedImages={selectedImages}
            setSelectedImages={setSelectedImages}
          />
        )}

        <MessageTextInput
          placeholder={t("chat.chat_with_ai") + "..."}
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          isCamera={true}
          isAI={true}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      </View>
    </KeyboardAvoidingView>
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

  return (
    <View flex bg-white>
      <AppBar back title={t("chat.chat_with_ai")} />
      <View useSafeArea flex>
        {renderChatUI()}
      </View>
    </View>
  );
};

export default AIChatScreen;
