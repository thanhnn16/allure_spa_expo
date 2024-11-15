import React, { useEffect } from "react";
import { Colors, Text, View } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import AppBar from "@/components/app-bar/AppBar";
import NotificationItem, { NotificationType } from "@/components/notification/NotificationItem";
import { FlatList, ActivityIndicator } from "react-native";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/redux/features/notification/notificationThunks";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Notification } from "@/redux/features/notification/types";

const NotificationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { notifications, loading } = useSelector(
    (state: RootState) => state.notification
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleNotificationPress = async (id: string) => {
    await dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      id={item.id}
      type={item.type as NotificationType}
      title={item.title}
      content={item.content}
      time={formatDistanceToNow(new Date(item.createdAt), {
        addSuffix: true,
        locale: vi,
      })}
      isRead={item.isRead}
      onPress={() => handleNotificationPress(item.id)}
    />
  );

  if (loading) {
    return (
      <View flex center>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View flex bg-white>
      <AppBar back title="Thông báo" />
      <View flex>
        <View row spread centerV padding-8 paddingH-24>
          <Text h3 color={Colors.gray}>
            Hôm nay
          </Text>
          {notifications.some((n: Notification) => !n.isRead) && (
            <Text h3 onPress={handleMarkAllAsRead}>
              Đánh dấu tất cả là đã đọc
            </Text>
          )}
        </View>
        <FlatList
          data={notifications}
          renderItem={renderItem}
          keyExtractor={(item: Notification) => item.id}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
      </View>
    </View>
  );
};

export default NotificationPage;
