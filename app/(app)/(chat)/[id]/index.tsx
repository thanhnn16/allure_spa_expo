import { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { View, Text, Colors } from "react-native-ui-lib";
import messaging from "@react-native-firebase/messaging";
import { useLocalSearchParams } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import MessageTextInput from "@/components/message/MessageTextInput";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import MessageBubble from "@/components/message/MessageBubble";

interface Message {
  id: string;
  message: string;
  sender_id: string;
  created_at: string;
}

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<FlatList>(null);

  useEffect(() => {
    const setupChat = async () => {
      try {
        setLoading(true);
        const response = await AxiosInstance().get(`/chats/${id}/messages`);
        setMessages(response.data);

        // Đăng ký FCM listener
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          if (remoteMessage.data?.chat_id === id) {
            const newMessage: Message = {
              id: remoteMessage.messageId || Date.now().toString(),
              message: String(remoteMessage.data?.message || ""),
              sender_id: String(remoteMessage.data?.sender_id || ""),
              created_at: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, newMessage]);
            scrollRef.current?.scrollToEnd({ animated: true });
          }
        });

        return () => unsubscribe();
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    setupChat();
  }, [id]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      const newMessage = {
        message: message.trim(),
        chat_id: id,
      };

      await AxiosInstance().post("/messages", newMessage);
      setMessage("");
      scrollRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBar title={i18n.t("chat.customer_care")} back />

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <FlatList
            ref={scrollRef}
            data={messages}
            renderItem={({ item }) => (
              <MessageBubble
                message={item}
                isOwn={item.sender_id === user?.id}
              />
            )}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.messageList}
            inverted={false}
            showsVerticalScrollIndicator={false}
          />

          <MessageTextInput
            message={message}
            setMessage={setMessage}
            handleSend={handleSend}
            placeholder={i18n.t("chat.type_message")}
            isAI={false}
            isCamera={true}
            selectedImages={[]}
            setSelectedImages={() => {}}
          />
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  keyboardView: {
    flex: 1,
  },
  messageList: {
    padding: 16,
    flexGrow: 1,
  },
  errorText: {
    color: Colors.red30,
    textAlign: "center",
    margin: 16,
  },
});

export default ChatScreen;
