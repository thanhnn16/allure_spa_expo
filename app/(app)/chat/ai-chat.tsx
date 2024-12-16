import { useEffect, useRef, useState } from "react";
import { FlatList, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import AppBar from "@/components/app-bar/AppBar";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import MessageBubble from "@/components/message/MessageBubble";
import MessageTextInput from "@/components/message/MessageTextInput";
import {
  fetchAiConfigs,
  sendImageMessage,
  sendTextMessage,
  clearMessages,
  addTemporaryMessage,
  removeTemporaryMessage,
} from "@/redux/features/ai/aiSlice";
import { AppDispatch, RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import { convertImageToBase64 } from "@/utils/helpers/imageHelper";
import { useLanguage } from "@/hooks/useLanguage";
import { ERROR_KEYS } from "@/constants/errorMessages";

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
  const [messageStatus, setMessageStatus] = useState(t("chat.sent"));
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
        setMessageStatus(t(ERROR_KEYS.FETCH_CONFIG_ERROR));
      });
  }, [dispatch]);

  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const sendInitialContext = async () => {
      if (hasInitialized || !configs || configs.length === 0) return;

      try {
        const activeConfig = configs.find(
          (config: any) =>
            config.type === "general_assistant" && config.is_active
        );

        if (!activeConfig) {
          throw new Error(ERROR_KEYS.NO_ACTIVE_CONFIG);
        }

        const userContext = {
          user_id: user?.id || t("common.guest"),
          full_name: user?.full_name || t("common.guest"),
          phone_number: user?.phone_number || "",
          email: user?.email || "",
          timestamp: new Date().toISOString(),
        };

        await dispatch(
          sendTextMessage({
            text: JSON.stringify(userContext),
            isSystemMessage: true,
          })
        ).unwrap();

        setHasInitialized(true);
      } catch (error: any) {
        console.error("Failed to send user context:", error);
        setMessageStatus(t(ERROR_KEYS.INIT_CHAT_ERROR));
      }
    };

    sendInitialContext();
  }, [configs, hasInitialized]);

  const [initialLoading, setInitialLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleNewChat = () => {
    dispatch(clearMessages());
    setMessage("");
    setSelectedImages([]);
    setMessageStatus(t("chat.sent"));
    setHasInitialized(false);
  };

  const handleSend = async () => {
    if (!message.trim() && selectedImages.length === 0) return;

    const currentMessage = message;
    setMessage("");
    setSelectedImages([]);
    setMessageStatus(t("chat.sent"));

    try {
      const activeConfig = configs.find(
        (config: any) => config.type === "general_assistant" && config.is_active
      );

      if (!activeConfig) {
        throw new Error(ERROR_KEYS.NO_ACTIVE_CONFIG);
      }

      dispatch(addTemporaryMessage(t("chat.thinking")));

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

      dispatch(removeTemporaryMessage());
    } catch (err: any) {
      console.error("Failed to send message:", err);
      const isErrorKey = Object.values(ERROR_KEYS).includes(err.message);
      const errorMessage = isErrorKey ? t(err.message) : err.message;
      setMessageStatus(`${t("common.error")}: ${errorMessage}`);
      dispatch(removeTemporaryMessage());
    }
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
        setMessageStatus(t("chat.sent"));
      } catch (err: any) {
        console.error("Failed to send guiding message:", err);
        setMessageStatus(`${t("common.error")}: ${err.message}`);
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

  useEffect(() => {
    if (messages.length > 0 && !isFirstLoad) {
      setTimeout(() => {
        scrollRef.current?.scrollToOffset({ offset: 0, animated: true });
      }, 100);
    }
  }, [messages]);

  useEffect(() => {
    if (isFirstLoad && messages.length > 0) {
      setIsFirstLoad(false);
    }
  }, []);

  const renderChatUI = () => (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View flex>
        <FlatList
          inverted
          data={[...messages.filter((msg: any) =>
            !msg.isTemporary &&
            !msg.isSystemMessage &&
            hasValidContent
          )].reverse()}
          renderItem={({ item, index }) => {
            const messageText = item.parts?.[0]?.text || "";
            const hasImages = item.parts?.some((p: any) => p.image);

            if (!messageText.trim() && !hasImages) return null;

            return (
              <View>
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
                />
                {item.role === "user" && (
                  <View row right paddingH-10 marginT-4 marginB-8>
                    <Text text90 color={Colors.grey30}>
                      {messageStatus}
                    </Text>
                  </View>
                )}
              </View>
            );
          }}
          ref={scrollRef}
          onContentSizeChange={() => {
            if (initialLoading) {
              setInitialLoading(false);
            }
          }}
          initialScrollIndex={0}
          keyExtractor={(item, index) => item.id || `msg-${index}`}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingHorizontal: 16,
            paddingTop: 16,
            justifyContent: hasMessages ? 'flex-start' : 'flex-end'
          }}
          ListEmptyComponent={renderEmptyState()}
          ListHeaderComponent={
            isThinking && (
              <View marginB-16 paddingH-16>
                <MessageBubble
                  message={{
                    id: 'thinking',
                    message: t("chat.thinking"),
                    sender_id: 'ai',
                    created_at: new Date().toISOString(),
                    attachments: [],
                  }}
                  isOwn={false}
                  isThinking={true}
                />
              </View>
            )
          }
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          automaticallyAdjustKeyboardInsets={true}
          onScrollBeginDrag={Keyboard.dismiss}
        />

        <View>
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
      </View>
    </KeyboardAvoidingView>
  );

  useEffect(() => {
    if (error) {
      const isErrorKey = Object.values(ERROR_KEYS).includes(error);
      const errorMessage = isErrorKey ? t(error) : error;
      setMessageStatus(`${t("common.error")}: ${errorMessage}`);
    }
  }, [error, t]);

  return (
    <View flex bg-white>
      <AppBar
        back
        title={t("chat.chat_with_ai")}
        rightComponent={
          hasMessages && (
            <TouchableOpacity onPress={handleNewChat}>
              <Ionicons name="create-outline" size={24} color={Colors.primary} />
            </TouchableOpacity>
          )
        }
      />
      <View useSafeArea flex>
        {renderChatUI()}
      </View>
    </View>
  );
};

export default AIChatScreen;
