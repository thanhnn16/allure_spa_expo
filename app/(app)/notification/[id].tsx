import React from "react";
import { ScrollView } from "react-native";
import { Colors, Text, View, TouchableOpacity } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, useLocalSearchParams } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import { Feather } from "@expo/vector-icons";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Animated, { FadeIn } from "react-native-reanimated";
import { Notification } from "@/redux/features/notification/types";
import {
  NotificationType,
  notificationTypeMap,
} from "@/components/notification/NotificationItem";
import i18n from "@/languages/i18n";

const NotificationDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const notification = useSelector((state: RootState) =>
    state.notification.notifications.find(
      (n: Notification) => n.id === Number(id)
    )
  );

  if (!notification) {
    return (
      <View flex center>
        <Text text70 color={Colors.grey40}>
          Không tìm thấy thông báo
        </Text>
      </View>
    );
  }

  const { iconName, iconColor, bgColor } =
    notificationTypeMap[notification.type as NotificationType] ||
    notificationTypeMap.system;

  const handleUrlPress = () => {
    if (notification.url) {
      router.push(notification.url);
    }
  };

  return (
    <View flex bg-white>
      <AppBar back title={i18n.t("notification.detail")} />
      <ScrollView>
        <Animated.View entering={FadeIn.duration(500)}>
          {/* Header Section */}
          <View padding-16 backgroundColor={bgColor}>
            <View center marginV-16>
              <View
                center
                width={60}
                height={60}
                br30
                backgroundColor={Colors.white}
                style={{
                  shadowColor: iconColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 4,
                }}
              >
                <Feather name={iconName as any} size={30} color={iconColor} />
              </View>
            </View>
            <Text text60BO center color={Colors.text} marginB-8>
              {notification.title}
            </Text>
            <Text text90 center color={Colors.grey40}>
              {formatDistanceToNow(new Date(notification.created_at), {
                addSuffix: true,
                locale: vi,
              })}
            </Text>
          </View>

          {/* Content Section */}
          <View padding-16>
            <View
              padding-16
              br20
              backgroundColor={Colors.white}
              style={{
                shadowColor: Colors.grey40,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text text70 color={Colors.text} style={{ lineHeight: 24 }}>
                {notification.content}
              </Text>

              {/* Media Preview if available */}
              {notification.media && (
                <View marginT-16>
                  <View
                    height={200}
                    br20
                    backgroundColor={Colors.grey70}
                    style={{
                      overflow: "hidden",
                    }}
                  >
                    {/* Add Image component here if needed */}
                  </View>
                </View>
              )}

              {/* Action Button if URL exists */}
              {notification.url && (
                <TouchableOpacity
                  onPress={handleUrlPress}
                  marginT-16
                  padding-12
                  br10
                  backgroundColor={Colors.primary}
                  center
                >
                  <Text text70BO white>
                    {i18n.t("notification.view_detail")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Additional Info Section */}
          <View padding-16>
            <View
              row
              spread
              padding-12
              br10
              marginB-8
              backgroundColor={Colors.grey70}
            >
              <Text text80 color={Colors.grey20}>
                {i18n.t("notification.type")}
              </Text>
              <Text text80 color={Colors.text}>
                {notification.type
                  .split("_")
                  .map(
                    (word: string) =>
                      word.charAt(0).toUpperCase() + word.slice(1)
                  )
                  .join(" ")}
              </Text>
            </View>
            <View row spread padding-12 br10 backgroundColor={Colors.grey70}>
              <Text text80 color={Colors.grey20}>
                {i18n.t("notification.status")}
              </Text>
              <View
                paddingH-8
                paddingV-4
                br20
                backgroundColor={
                  notification.is_read ? Colors.grey60 : Colors.primary_light
                }
              >
                <Text
                  text80
                  color={notification.is_read ? Colors.grey30 : Colors.primary}
                >
                  {notification.is_read ? i18n.t("notification.read") : i18n.t("notification.unread")}
                </Text>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default NotificationDetail;
