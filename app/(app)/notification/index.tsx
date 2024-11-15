import React, { useEffect } from "react";
import { Colors, Text, View, TouchableOpacity } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import AppBar from "@/components/app-bar/AppBar";
import NotificationItem, {
  NotificationType,
} from "@/components/notification/NotificationItem";
import { FlatList, ActivityIndicator } from "react-native";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  loadMoreNotifications,
} from "@/redux/features/notification/notificationThunks";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Notification } from "@/redux/features/notification/types";
import EmptyNotification from "@/components/notification/EmptyNotification";

const NotificationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    notifications = [],
    loading,
    hasMore,
  } = useSelector((state: RootState) => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleNotificationPress = async (id: number) => {
    await dispatch(markNotificationAsRead(id));
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(loadMoreNotifications());
    }
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      id={item.id}
      type={item.type as NotificationType}
      title={item.title}
      content={item.content}
      time={formatDistanceToNow(new Date(item.created_at), {
        addSuffix: true,
        locale: vi,
      })}
      isRead={item.is_read}
      onPress={() => handleNotificationPress(item.id)}
    />
  );

  if (loading && !notifications?.length) {
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
        {!loading && notifications?.length === 0 && (
          <EmptyNotification showHeader={false} />
        )}
        {notifications?.length > 0 && (
          <>
            <View
              row
              spread
              centerV
              padding-16
              backgroundColor={Colors.white}
              style={{
                borderBottomWidth: 1,
                borderBottomColor: Colors.grey70,
              }}
            >
              <Text text70 color={Colors.gray}>
                Tất cả thông báo
              </Text>
              {notifications?.some((n: Notification) => !n.is_read) && (
                <TouchableOpacity onPress={handleMarkAllAsRead}>
                  <Text text70 color={Colors.primary}>
                    Đánh dấu tất cả là đã đọc
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <FlatList
              data={notifications}
              renderItem={renderItem}
              keyExtractor={(item: Notification) => item.id.toString()}
              contentContainerStyle={{
                paddingVertical: 12,
              }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={() =>
                loading && (
                  <ActivityIndicator
                    size="small"
                    color={Colors.primary}
                    style={{ marginVertical: 16 }}
                  />
                )
              }
            />
          </>
        )}
      </View>
    </View>
  );
};

export default NotificationPage;
