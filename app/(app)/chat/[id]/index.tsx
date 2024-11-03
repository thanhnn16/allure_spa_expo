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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";
import MessageTextInput from "@/components/message/MessageTextInput";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import MessageBubble from "@/components/message/MessageBubble";
import { fetchMessagesThunk } from "@/redux/features/chat/fetchMessagesThunk";
import { sendMessageThunk } from "@/redux/features/chat/sendMessageThunk";
import { markAsReadThunk } from "@/redux/features/chat/markAsReadThunk";
import { addMessage } from "@/redux/features/chat/chatSlice";

const ChatScreen = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { messages, isLoading, error } = useSelector(
    (state: RootState) => state.chat
  );
  const [message, setMessage] = useState("");
  const scrollRef = useRef<FlatList>(null);

  useEffect(() => {
    const setupChat = async () => {
      try {
        await dispatch(fetchMessagesThunk(id as string)).unwrap();
        dispatch(markAsReadThunk(id as string));

        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
          if (remoteMessage.data?.chat_id === id) {
            const newMessage = {
              id: remoteMessage.messageId || Date.now().toString(),
              chat_id: remoteMessage.data.chat_id,
              message: String(remoteMessage.data?.message || ""),
              sender_id: String(remoteMessage.data?.sender_id || ""),
              created_at: new Date().toISOString(),
            };
            dispatch(addMessage(newMessage));
            scrollRef.current?.scrollToEnd({ animated: true });
          }
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Error setting up chat:", err);
      }
    };

    setupChat();
  }, [id, dispatch]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    try {
      await dispatch(
        sendMessageThunk({
          chat_id: id as string,
          message: message.trim(),
        })
      ).unwrap();
      setMessage("");
      scrollRef.current?.scrollToEnd({ animated: true });
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AppBar title={i18n.t("chat.customer_care")} back />

      {isLoading ? (
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
