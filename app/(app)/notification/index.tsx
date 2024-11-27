import React, { useEffect, useState } from "react";
import {
  Colors,
  Text,
  View,
  TouchableOpacity,
  SkeletonView,
} from "react-native-ui-lib";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import AppBar from "@/components/app-bar/AppBar";
import NotificationItem, {
  NotificationType,
} from "@/components/notification/NotificationItem";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  SectionList,
} from "react-native";
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  loadMoreNotifications,
} from "@/redux/features/notification/notificationThunks";
import { Notification } from "@/redux/features/notification/types";
import EmptyNotification from "@/components/notification/EmptyNotification";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslatedNotification } from "@/hooks/useTranslatedNotification";
import { useFormattedTime } from "@/hooks/useFormattedTime";
import moment from "moment";
import "moment/locale/vi"; // Import Vietnamese locale

import { router } from "expo-router";

interface GroupedNotifications {
  title: string;
  data: Notification[];
}

const NotificationPage: React.FC = () => {
  const { t } = useLanguage();

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
    try {
      await dispatch(markNotificationAsRead(id));
      router.push(`/notification/${id}`);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      // Optionally show error message to user
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead());
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
      // Optionally show error message to user
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      dispatch(loadMoreNotifications());
    }
  };

  const onRefresh = React.useCallback(async () => {
    try {
      setRefreshing(true);
      await dispatch(fetchNotifications());
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
      // Optionally show error message to user
    } finally {
      setRefreshing(false);
    }
  }, [dispatch]);

  const groupNotifications = (
    notifications: Notification[]
  ): GroupedNotifications[] => {
    const groups: { [key: string]: Notification[] } = {};

    notifications.forEach((notification) => {
      const date = moment(notification.created_at);
      let groupTitle: string;

      if (date.isSame(moment(), "day")) {
        groupTitle = t("time.today");
      } else if (date.isSame(moment().subtract(1, "day"), "day")) {
        groupTitle = t("time.yesterday");
      } else if (date.isSame(moment(), "week")) {
        groupTitle = t("time.this_week");
      } else if (date.isSame(moment(), "month")) {
        groupTitle = t("time.this_month");
      } else {
        groupTitle = date.format("MM/YYYY");
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

  const renderSectionHeader = ({
    section,
  }: {
    section: GroupedNotifications;
  }) => (
    <View padding-12 backgroundColor={Colors.grey60}>
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
  }) => {
    const translatedNotification = useTranslatedNotification(item);
    const formattedTime = useFormattedTime(item.created_at_timestamp);

    return (
      <Animated.View entering={FadeInDown.delay(index * 100).springify()}>
        <NotificationItem
          id={item.id}
          type={item.type as NotificationType}
          title={translatedNotification.title}
          content={translatedNotification.content}
          time={formattedTime}
          isRead={item.is_read}
          onPress={() => handleNotificationPress(item.id)}
        />
      </Animated.View>
    );
  };

  if (loading && !notifications?.length) {
    return (
      <View flex bg-white>
        <AppBar back title={t("notification.title")} />
        <View centerH flex>
          {[...Array(8)].map((_, index) => (
            <SkeletonView
              key={index}
              showContent={false}
              borderRadius={8}
              height={80}
              width={Dimensions.get("window").width - 32}
              marginV-8
              center
            />
          ))}
        </View>
      </View>
    );
  }

  return (
    <View flex bg-white>
      <AppBar back title={t("notification.title")} />
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
                borderBottomColor: Colors.grey60,
              }}
            >
              <View row centerV>
                <Text h3 color={Colors.text} marginR-8>
                  {t("notification.all_notifications")}
                </Text>
                {notifications.filter((n: Notification) => !n.is_read).length >
                  0 && (
                  <View
                    style={{
                      backgroundColor: Colors.primary,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 12,
                    }}
                  >
                    <Text text80 white>
                      {
                        notifications.filter((n: Notification) => !n.is_read)
                          .length
                      }
                    </Text>
                  </View>
                )}
              </View>
              {notifications?.some((n: Notification) => !n.is_read) && (
                <TouchableOpacity
                  onPress={handleMarkAllAsRead}
                  style={{
                    paddingVertical: 6,
                    paddingHorizontal: 12,
                    borderRadius: 16,
                    backgroundColor: Colors.primary,
                  }}
                >
                  <Text text80 white>
                    {t("notification.mark_all_as_read")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <SectionList
              sections={groupNotifications(notifications)}
              renderItem={renderItem}
              renderSectionHeader={renderSectionHeader}
              keyExtractor={(item: Notification) => item.id.toString()}
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
                      {t("notification.loading_more")}
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
