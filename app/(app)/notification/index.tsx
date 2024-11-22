import React, { useEffect, useState } from "react";
import { Colors, Text, View, TouchableOpacity } from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import AppBar from "@/components/app-bar/AppBar";
import NotificationItem, {
  NotificationType,
} from "@/components/notification/NotificationItem";
import { FlatList, ActivityIndicator, RefreshControl, SectionList } from "react-native";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  loadMoreNotifications,
} from "@/redux/features/notification/notificationThunks";
import { formatDistanceToNow, format, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns";
import { vi } from "date-fns/locale";
import { Notification } from "@/redux/features/notification/types";
import EmptyNotification from "@/components/notification/EmptyNotification";
import Animated, { FadeInDown } from "react-native-reanimated";
import i18n from "@/languages/i18n";
import { router } from "expo-router";

interface GroupedNotifications {
  title: string;
  data: Notification[];
}

const NotificationPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    notifications = [],
    loading,
    hasMore,
  } = useSelector((state: RootState) => state.notification);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleNotificationPress = async (id: number) => {
    await dispatch(markNotificationAsRead(id));
    router.push(`/notification/${id}`);
  };

  const handleMarkAllAsRead = async () => {
    await dispatch(markAllNotificationsAsRead());
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(loadMoreNotifications());
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await dispatch(fetchNotifications());
    setRefreshing(false);
  }, [dispatch]);

  const groupNotifications = (notifications: Notification[]): GroupedNotifications[] => {
    const groups: { [key: string]: Notification[] } = {};
    
    notifications.forEach(notification => {
      const date = new Date(notification.created_at);
      let groupTitle: string;
      
      if (isToday(date)) {
        groupTitle = "Hôm nay";
      } else if (isYesterday(date)) {
        groupTitle = "Hôm qua";
      } else if (isThisWeek(date)) {
        groupTitle = "Tuần này";
      } else if (isThisMonth(date)) {
        groupTitle = "Tháng này";
      } else {
        groupTitle = format(date, 'MM/yyyy');
      }
      
      if (!groups[groupTitle]) {
        groups[groupTitle] = [];
      }
      groups[groupTitle].push(notification);
    });

    return Object.entries(groups).map(([title, data]) => ({
      title,
      data,
    }));
  };

  const renderSectionHeader = ({ section }: { section: GroupedNotifications }) => (
    <View
      padding-12
      backgroundColor={Colors.grey60}
    >
      <Text text80M color={Colors.grey20}>
        {section.title}
      </Text>
    </View>
  );

  const renderItem = ({
    item,
    index,
  }: {
    item: Notification;
    index: number;
  }) => (
    <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
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
    </Animated.View>
  );

  if (loading && !notifications?.length) {
    return (
      <View flex center bg-white>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text marginT-8 h2_bold color={Colors.grey40}>
          {i18n.t("notification.loading")}
        </Text>
      </View>
    );
  }

  return (
    <View flex bg-white>
      <AppBar back title={i18n.t("notification.title")} />
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
                borderBottomWidth: 0.5,
                borderBottomColor: Colors.grey60,
                shadowColor: Colors.grey40,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              <Text h2_bold color={Colors.text}>
                {i18n.t("notification.all_notifications")}
              </Text>
              {notifications?.some((n: Notification) => !n.is_read) && (
                <TouchableOpacity
                  onPress={handleMarkAllAsRead}
                  style={{
                    padding: 8,
                    borderRadius: 6,
                    backgroundColor: Colors.primary_light,
                  }}
                >
                  <Text text80BO color={Colors.primary}>
                    {i18n.t("notification.mark_all_as_read")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <SectionList
              sections={groupNotifications(notifications)}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              keyExtractor={(item: Notification) => item.id.toString()}
              contentContainerStyle={{
                paddingVertical: 12,
              }}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={[Colors.primary]}
                  tintColor={Colors.primary}
                />
              }
              ListFooterComponent={() =>
                loading && (
                  <View center padding-16>
                    <ActivityIndicator size="small" color={Colors.primary} />
                    <Text marginT-8 text80 color={Colors.grey40}>
                      {i18n.t("notification.loading_more")}
                    </Text>
                  </View>
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
