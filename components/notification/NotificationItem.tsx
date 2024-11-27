import React from "react";
import { View, Text, TouchableOpacity, Colors } from "react-native-ui-lib";
import { Feather } from "@expo/vector-icons";
import { useTranslatedNotification } from "../../hooks/useTranslatedNotification";
import { handleNotificationNavigation } from "@/utils/services/notification/notificationHandler";

export type NotificationType =
  | "new_appointment"
  | "appointment_status"
  | "new_order"
  | "order_status"
  | "new_message"
  | "new_review"
  | "promotion"
  | "payment"
  | "system";

interface NotificationItemProps {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  url?: string;
  data?: any;
  status?: string;
  onPress?: () => void;
}

export const notificationTypeMap: Record<
  NotificationType,
  {
    iconName: string;
    iconColor: string;
    bgColor: string;
    group: string;
  }
> = {
  new_appointment: {
    iconName: "calendar",
    iconColor: Colors.secondary,
    bgColor: "#FFF5EE",
    group: "appointment",
  },
  appointment_status: {
    iconName: "clock",
    iconColor: Colors.secondary,
    bgColor: "#FFF5EE",
    group: "appointment",
  },
  new_order: {
    iconName: "shopping-bag",
    iconColor: Colors.primary,
    bgColor: Colors.primary_light,
    group: "order",
  },
  order_status: {
    iconName: "package",
    iconColor: Colors.primary,
    bgColor: Colors.primary_light,
    group: "order",
  },
  new_message: {
    iconName: "message-circle",
    iconColor: Colors.primary,
    bgColor: Colors.primary_light,
    group: "chat",
  },
  new_review: {
    iconName: "star",
    iconColor: "#FFB800",
    bgColor: "#FFF8E7",
    group: "review",
  },
  promotion: {
    iconName: "tag",
    iconColor: Colors.secondary,
    bgColor: "#FFF5EE",
    group: "promotion",
  },
  system: {
    iconName: "alert-circle",
    iconColor: Colors.text,
    bgColor: Colors.grey70,
    group: "system",
  },
  payment: {
    iconName: "credit-card",
    iconColor: Colors.primary,
    bgColor: Colors.primary_light,
    group: "payment",
  },
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  id,
  type,
  title: originalTitle,
  content: originalContent,
  time,
  isRead,
  data,
  onPress,
}) => {
  const { title, content } = useTranslatedNotification({
    id,
    title: originalTitle,
    content: originalContent,
    type,
    is_read: isRead,
    created_at: time,
    data,
    formatted_date: time,
  });

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (data) {
      handleNotificationNavigation({ type, ...data });
    }
  };

  const { iconName, iconColor, bgColor } =
    notificationTypeMap[type] || notificationTypeMap.system;

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.7}>
      <View
        padding-16
        marginH-12
        marginV-4
        bg-white
        br20
        style={{
          opacity: isRead ? 0.9 : 1,
          shadowColor: Colors.grey40,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 3,
          elevation: isRead ? 1 : 2,
        }}
      >
        <View row centerV>
          {/* Icon Container - Updated styling */}
          <View
            center
            width={40}
            height={40}
            br20
            marginR-12
            backgroundColor={isRead ? Colors.grey70 : bgColor}
            style={{
              shadowColor: iconColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: isRead ? 0 : 2,
            }}
          >
            <Feather
              name={iconName as any}
              size={20}
              color={isRead ? Colors.grey30 : iconColor}
            />
          </View>

          {/* Content Container */}
          <View flex>
            <View row spread centerV marginB-4>
              <Text
                flex-3
                h3_bold={!isRead}
                h3={isRead}
                color={isRead ? Colors.grey30 : Colors.text}
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text flex-1 right h4_bold color={Colors.grey40} marginL-8>
                {time}
              </Text>
            </View>

            <Text
              h4
              color={isRead ? Colors.grey40 : Colors.grey20}
              numberOfLines={2}
              style={{ lineHeight: 18 }}
            >
              {content}
            </Text>
          </View>
        </View>

        {/* Updated unread indicator */}
        {!isRead && (
          <View
            absR
            marginR-12
            marginT-6
            width={6}
            height={6}
            br100
            backgroundColor={Colors.primary}
            style={{
              shadowColor: Colors.primary,
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 2,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default NotificationItem;
