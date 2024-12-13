import React from "react";
import { ScrollView } from "react-native";
import { Colors, Text, View } from "react-native-ui-lib";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useRouter, useLocalSearchParams, Href } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import { Feather } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { Notification } from "@/redux/features/notification/types";
import {
  NotificationType,
  notificationTypeMap,
  notificationTypeTranslations,
} from "@/components/notification/NotificationItem";
import { useLanguage } from "@/hooks/useLanguage";

import AppButton from "@/components/buttons/AppButton";
import { useTranslatedNotification } from "@/hooks/useTranslatedNotification";
import { useFormattedTime } from "@/hooks/useFormattedTime";

// Thêm type definition cho ngôn ngữ được hỗ trợ
type SupportedLanguage = "en" | "vi" | "ja";

const NotificationDetail: React.FC = () => {
  const { t } = useLanguage();

  const router = useRouter();
  const { id } = useLocalSearchParams();
  const notification = useSelector((state: RootState) =>
    state.notification.notifications.find(
      (n: Notification) => n.id === Number(id)
    )
  );

  console.log(notification);

  const translatedNotification = useTranslatedNotification(notification);

  const formattedTime = useFormattedTime(notification.created_at_timestamp);

  if (!notification) {
    return (
      <View flex center>
        <Text h2_bold color={Colors.grey40}>
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

  const renderActionButton = () => {
    if (!notification) return null;

    const type = notification.type as NotificationType;
    let actionText = "";
    let onActionPress = () => { };

    switch (type) {
      case "new_appointment":
      case "appointment_new":
      case "appointment_status":
        actionText = t("notification.view_appointment");
        onActionPress = () => router.push(`/(app)/appointment/${notification.data?.appointment_id}`);
        break;

      case "new_order":
      case "order_new":
      case "order_status":
      case "order_cancelled":
      case "order_completed":
        actionText = t("notification.view_order");
        onActionPress = () =>
          router.push(`/(app)/order/${notification.data?.order_id}`);
        break;

      case "new_message":
        actionText = t("notification.view_conversation");
        onActionPress = () =>
          router.push(`/chat/${notification.data?.conversation_id}`);
        break;

      case "promotion":
        actionText = t("notification.view_promotion");
        onActionPress = () =>
          router.push(`/reward/${notification.data?.promotion_id}`);
        break;

      case "new_review":
        actionText = t("notification.view_review");
        onActionPress = () => router.push(`/rating/${notification.data?.review_id}`);
        break;

      default:
        return null;
    }

    return (
      <AppButton
        onPress={onActionPress}
        type="outline"
        buttonStyle={{ marginTop: 16 }}
        children={
          <View row width="100%" center gap-4 centerV>
            <Text h3_bold color={Colors.primary}>
              {actionText}
            </Text>
            <Feather name="arrow-right" size={16} color={Colors.primary} />
          </View>
        }
      />
    );
  };

  const getTranslatedType = (type: NotificationType) => {
    const language = useSelector(
      (state: RootState) => state.language.currentLanguage
    );

    // Kiểm tra xem ngôn ngữ có được hỗ trợ không
    if (!["en", "vi", "ja"].includes(language)) {
      return type; // Trả về type gốc nếu ngôn ngữ không được hỗ trợ
    }

    return (
      notificationTypeTranslations[language as SupportedLanguage]?.[type] ||
      type
    );
  };

  return (
    <View flex bg-white>
      <AppBar back title={t("notification.detail")} />
      <ScrollView style={{ backgroundColor: Colors.background }}>
        <Animated.View entering={FadeIn.duration(500)}>
          {/* Header Section - Improved Icon */}
          <View padding-20>
            <View center marginB-20>
              <View
                center
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: Colors.primary_blur,
                  borderWidth: 1,
                  borderColor: Colors.primary_light,
                }}
              >
                <Feather
                  name={iconName as any}
                  size={24}
                  color={Colors.primary}
                />
              </View>
            </View>

            <Text h2_bold center color={Colors.text} marginB-12>
              {translatedNotification.title}
            </Text>

            <View
              row
              centerV
              center
              marginB-20
              style={{
                backgroundColor: Colors.primary_blur,
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 12,
                alignSelf: "center",
              }}
            >
              <Feather name="clock" size={14} color={Colors.primary} />
              <Text h4 marginL-4 color={Colors.primary}>
                {formattedTime}
              </Text>
            </View>
          </View>

          {/* Content Section - Updated */}
          <View padding-20>
            <View
              padding-20
              br20
              backgroundColor={Colors.surface}
              style={{
                borderWidth: 1,
                borderColor: Colors.primary_blur,
              }}
            >
              <Text h3 color={Colors.text} style={{ lineHeight: 24 }}>
                {translatedNotification.content}
              </Text>

              {renderActionButton()}

              {notification.url && (
                <View row centerV>
                  <AppButton
                    onPress={handleUrlPress}
                    marginT-16
                    type="outline"
                    title={t("notification.view_detail")}
                  />
                  <Feather
                    name="external-link"
                    size={20}
                    color={Colors.primary}
                  />
                </View>
              )}
            </View>
          </View>

          {/* Additional Info Section */}
          <View padding-20>
            <View
              padding-16
              br20
              backgroundColor={Colors.surface}
              style={{
                borderWidth: 1,
                borderColor: Colors.primary_blur,
              }}
            >
              <View row spread marginB-12>
                <Text h3 color={Colors.text}>
                  {t("notification.type")}
                </Text>
                <Text h3 color={Colors.primary}>
                  {getTranslatedType(notification.type)}
                </Text>
              </View>

              <View row spread centerV>
                <Text h3 color={Colors.text}>
                  {t("notification.status")}
                </Text>
                <View
                  paddingH-12
                  paddingV-6
                  br20
                  backgroundColor={
                    notification.is_read ? Colors.primary_blur : Colors.primary
                  }
                >
                  <Text
                    h3
                    color={notification.is_read ? Colors.primary : Colors.white}
                  >
                    {notification.is_read
                      ? t("notification.read")
                      : t("notification.unread")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
};

export default NotificationDetail;
