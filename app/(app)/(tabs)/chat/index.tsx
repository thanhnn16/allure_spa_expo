import { Href, router } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native-ui-lib";
import { StyleSheet, FlatList } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchChatsThunk } from "@/redux/features/chat/fetchChatsThunk";
import * as Notifications from "expo-notifications";
import messaging from "@react-native-firebase/messaging";
import FirebaseService from "@/utils/services/firebase/firebaseService";

import IconCskh from "@/assets/icons/cskh.svg";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { updateChatLastMessage } from "@/redux/features/chat/chatSlice";

const ChatListScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { chats, isLoading } = useSelector((state: RootState) => state.chat);

  useEffect(() => {
    // Fetch chats khi component mount
    dispatch(fetchChatsThunk());

    const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
      console.log("Received foreground message:", remoteMessage);

      if (remoteMessage.data?.type === "chat_message") {
        // Hiển thị notification
        await FirebaseService.showChatNotification(remoteMessage);

        const newMessage = {
          id: remoteMessage.messageId || Date.now().toString(),
          chat_id: remoteMessage.data.chat_id,
          message: String(remoteMessage.data?.message || ""),
          sender_id: String(remoteMessage.data?.sender_id || ""),
          created_at: new Date().toISOString(),
        };

        dispatch(
          updateChatLastMessage({
            chatId: remoteMessage.data.chat_id,
            message: newMessage,
          })
        );
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  const chatDataWithAI = [
    { id: "ai" }, // Chat AI luôn ở đầu
    ...(chats || []), // Thêm null check
  ];

  const handleChatScreen = (id: string) => {
    if (id === "ai") {
      return router.push("/(app)/chat/ai-chat" as Href<string>);
    } else {
      return router.push({
        pathname: "/(app)/chat/[id]",
        params: { id },
      } as Href<string>);
    }
  };

  const renderItem = ({ item }: { item: any }) => {
    // Nếu là chat AI
    if (item.id === "ai") {
      return (
        <TouchableOpacity
          onPress={() => handleChatScreen("ai")}
          style={styles.chatItem}
        >
          <Image source={IconCskh} style={styles.avatar} />
          <View style={styles.messageContainer}>
            <Text h2_bold>{i18n.t("chat.chat_with_ai")}</Text>
            <Text h3 numberOfLines={1}>
              {i18n.t("chat.ai_description")}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Nếu là chat với admin/staff
    const lastMessage =
      item.messages?.[0]?.message || i18n.t("chat.no_messages");
    const lastMessageTime = item.messages?.[0]?.created_at;

    return (
      <TouchableOpacity
        onPress={() => handleChatScreen(item.id)}
        style={styles.chatItem}
      >
        <Image source={IconCskh} style={styles.avatar} />
        <View style={styles.messageContainer}>
          <Text h2_bold>{i18n.t("chat.customer_care")}</Text>
          <Text h3 numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
        {lastMessageTime && (
          <Text h3>
            {formatDistanceToNow(new Date(lastMessageTime), {
              locale: vi,
              addSuffix: true,
            })}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex bg-$backgroundDefault>
        <AppBar title={i18n.t("pageTitle.chat")} />
        <FlatList
          data={chatDataWithAI}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={() => dispatch(fetchChatsThunk())}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    paddingHorizontal: 16,
  },
  chatItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 12,
    borderRadius: 20,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
  },
});

export default ChatListScreen;
