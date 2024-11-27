import { Href, router } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native-ui-lib";
import { StyleSheet, FlatList } from "react-native";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchChatsThunk } from "@/redux/features/chat/fetchChatsThunk";
import messaging from "@react-native-firebase/messaging";

import IconCskh from "@/assets/icons/cskh.svg";
import AppBar from "@/components/app-bar/AppBar";
import { updateChatLastMessage } from "@/redux/features/chat/chatSlice";
import AppDialog from "@/components/dialog/AppDialog";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import moment from 'moment';
import 'moment/locale/vi';


const ChatListScreen = () => {
  const { t } = useLanguage();

  const dispatch = useDispatch<AppDispatch>();
  const { chats, isLoading } = useSelector((state: RootState) => state.chat);
  const { isGuest } = useAuth();
  const [loginDialogVisible, setLoginDialogVisible] = useState(false);

  useEffect(() => {
    if (!isGuest) {
      dispatch(fetchChatsThunk());

      const unsubscribe = messaging().onMessage(async (remoteMessage: any) => {
        if (
          remoteMessage.data?.type === "chat_message" &&
          remoteMessage.messageId
        ) {
          const newMessage = {
            id: remoteMessage.messageId,
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
    } else {
      setLoginDialogVisible(true);
    }
  }, [dispatch, isGuest]);

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
            <Text h3_bold>{t("chat.chat_with_ai")}</Text>
            <Text h3 numberOfLines={1}>
              {t("chat.ai_description")}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    // Nếu là chat với admin/staff
    const lastMessage = item.messages?.[0]?.message || t("chat.no_messages");
    const lastMessageTime = item.messages?.[0]?.created_at;

    return (
      <TouchableOpacity
        onPress={() => handleChatScreen(item.id)}
        style={styles.chatItem}
      >
        <Image source={IconCskh} style={styles.avatar} />
        <View style={styles.messageContainer}>
          <Text h3_bold>{t("chat.customer_care")}</Text>
          <Text h3 numberOfLines={1}>
            {lastMessage}
          </Text>
        </View>
        {lastMessageTime && (
          <Text h3>
            {moment(lastMessageTime).fromNow()}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  const handleLoginConfirm = () => {
    setLoginDialogVisible(false);
    router.replace("/(auth)");
  };

  return (
    <View flex bg-$backgroundDefault>
      <AppBar title={t("pageTitle.chat")} />
      {isGuest ? (
        <AppDialog
          visible={loginDialogVisible}
          title={t("auth.login.login_required")}
          description={t("auth.login.login_chat")}
          closeButtonLabel={t("common.cancel")}
          confirmButtonLabel={t("auth.login.login_now")}
          severity="info"
          onClose={() => setLoginDialogVisible(false)}
          onConfirm={handleLoginConfirm}
        />
      ) : (
        <FlatList
          data={chatDataWithAI}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={() => dispatch(fetchChatsThunk())}
        />
      )}
    </View>
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
