import { Href, router } from "expo-router";
import { View, Text, TouchableOpacity, Image } from "react-native-ui-lib";
import { StyleSheet, FlatList } from "react-native";

import IconCskh from "@/assets/icons/cskh.svg";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import { SafeAreaView } from "react-native-safe-area-context";

const chatData = [
  {
    id: "0",
    title: i18n.t("chat.customer_care"),
    message:
      "Bạn đã đặt hàng thành công cho đơn hàng: Làm sạch bằng lamellar..",
    time: "1h",
  },
  {
    id: "1",
    title: i18n.t("chat.chat_with_ai"),
    message:
      "Bạn đã hủy lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy l..",
    time: "2h",
  },
];

const handleChatScreen = (id: string) => {
  if (id === "0") {
    return router.push("/(app)/chat/ai-chat" as Href<string>);
  } else {
    return router.push("/(app)/chat/xxx" as Href<string>);
  }
};

const ChatScreen = () => {
  const renderItem = ({ item }: { item: (typeof chatData)[0] }) => (
    <TouchableOpacity
      onPress={() => handleChatScreen(item.id)}
      style={styles.chatItem}
    >
      {item.id === "0" && (
        <Image source={IconCskh} style={{ marginRight: 12 }} />
      )}
      {item.id === "1" && (
        <Image source={IconCskh} style={{ marginRight: 12 }} />
      )}
      <View style={styles.messageContainer}>
        <Text h2_bold>{item.title}</Text>
        <Text h3>{item.message}</Text>
      </View>
      <Text h3>{item.time}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex bg-$backgroundDefault>
        <AppBar title={i18n.t("pageTitle.chat")} />
        <FlatList
          data={chatData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 16 }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  chatItem: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  messageContainer: {
    flex: 1,
    alignSelf: "center",
  },
});

export default ChatScreen;
