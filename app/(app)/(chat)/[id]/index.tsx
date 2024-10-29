import { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Image, View, Text, Colors, Keyboard } from "react-native-ui-lib";
import messaging from "@react-native-firebase/messaging";

import MessageBubble from "@/components/message/message_bubble";
import messagesData from "../../../../data/chat/ChatDefaultData";
import MessageTextInput from "@/components/message/message_textinput";
import AppBar from "@/components/app-bar/AppBar";
import SelectImagesBar from "@/components/images/SelectImagesBar";
import i18n from "@/languages/i18n";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
const ChatScreen = () => {
  const [message, setMessage] = useState("");
  const [messageStatus, setMessageStatus] = useState("Đã gửi");
  const scrollRef = useRef<FlatList>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const KeyboardTrackingView = Keyboard.KeyboardTrackingView;
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    // Request permission and get FCM token
    const setupFCM = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        const token = await messaging().getToken();
        setFcmToken(token);

        // Register token with backend
        await AxiosInstance().post("/users/fcm-token", {
          user_id: userId,
          fcm_token: token,
          device_type: "expo",
        });
      }
    };

    setupFCM();

    // Listen to FCM messages
    const unsubscribe = messaging().onMessage(async (remoteMessage) => {
      if (remoteMessage.data?.type === "chat_message") {
        const newMessage = {
          id: remoteMessage.messageId,
          text: remoteMessage.data.message,
          sender: remoteMessage.data.sender_id,
          time: new Date().toLocaleTimeString(),
        };
        messagesData.push(newMessage);
        scrollRef.current?.scrollToEnd({ animated: true });
      }
    });

    return unsubscribe;
  }, []);

  const handleSend = async () => {
    if (message.trim() === "") return;

    // Send message to backend
    try {
      const response = await fetch("your-api-url/api/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add your auth headers here
        },
        body: JSON.stringify({
          chat_id: id, // from route params
          message: message,
          fcm_token: fcmToken,
        }),
      });

      if (response.ok) {
        setMessage("");
        scrollRef.current?.scrollToEnd({ animated: true });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleRead = () => {
    return (
      <View style={styles.statusContainer}>
        <Text>{messageStatus}</Text>
        {messageStatus === "Đã đọc"}
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar title={i18n.t("chat.customer_care")} />

      <FlatList
        data={messagesData}
        renderItem={({ item }) => <MessageBubble item={item} />}
        ref={scrollRef}
        onContentSizeChange={() =>
          scrollRef.current?.scrollToEnd({ animated: true })
        }
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListFooterComponent={handleRead}
      />

      {selectedImages.length > 0 && (
        <SelectImagesBar
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
          isRating={false}
        />
      )}

      <KeyboardTrackingView useSafeArea addBottomView>
        <MessageTextInput
          placeholder={
            i18n.t("chat.chat_with") + " " + i18n.t("chat.customer_care") + ".."
          }
          message={message}
          setMessage={setMessage}
          handleSend={handleSend}
          isCamera={true}
          isAI={false}
          selectedImages={selectedImages}
          setSelectedImages={setSelectedImages}
        />
      </KeyboardTrackingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingHorizontal: 16,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    paddingHorizontal: 10,
  },
});

export default ChatScreen;
