import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Text, View } from "react-native-ui-lib";
import AppBar from "@/components/app-bar/AppBar";
import NotificationItem from "@/components/notification/NotificationItem";
import { FlatList } from "react-native";

// Types
type NotificationType = "success" | "cancel" | "reschedule";

interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  type: NotificationType;
  isRead: boolean;
}

// Data
const notificationData: Notification[] = [
  {
    id: "1",
    title: "Đặt hàng thành công",
    content:
      "Bạn đã đặt hàng thành công cho đơn hàng: Làm sạch bằng lamellar..",
    time: "1h trước",
    type: "success",
    isRead: false,
  },
  {
    id: "2",
    title: "Đã huỷ lịch hẹn",
    content:
      "Bạn đã huỷ lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy l...",
    time: "2h trước",
    type: "cancel",
    isRead: true,
  },
  {
    id: "3",
    title: "Đã đổi lịch hẹn",
    content:
      "Bạn đã đổi lịch hẹn thành công cho dịch vụ: Kiểm tra và sửa chữa máy lạnh. V...",
    time: "3h trước",
    type: "reschedule",
    isRead: true,
  },
];

const NotificationPage: React.FC = () => {
  const handleNotificationPress = (id: string) => {
    console.log(`Notification ${id} pressed`);
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      id={item.id}
      type={item.type}
      title={item.title}
      content={item.content}
      time={item.time}
      isRead={item.isRead}
      onPress={() => handleNotificationPress(item.id)}
    />
  );

  return (
    <View flex bg-white>
      <AppBar back title="Thông báo" />
      <View flex>
        <View row spread centerV padding-8 paddingH-24>
          <Text h3 color={Colors.gray}>
            Hôm nay
          </Text>
          <Text h3>Đánh dấu tất cả là đã đọc</Text>
        </View>
        <FlatList
          data={notificationData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>
    </View>
  );
};

export default NotificationPage;
