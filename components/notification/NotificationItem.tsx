import React from "react";
import { View, Text, TouchableOpacity, Colors } from "react-native-ui-lib";
import { Feather } from "@expo/vector-icons";

export type NotificationType =
  | "new_order" // Đơn hàng mới
  | "order_status" // Cập nhật trạng thái đơn hàng
  | "new_appointment" // Lịch hẹn mới
  | "appointment_status" // Cập nhật trạng thái lịch hẹn
  | "new_review" // Đánh giá mới
  | "new_message" // Tin nhắn mới
  | "promotion" // Khuyến mãi
  | "system" // Thông báo hệ thống
  | "payment"; // Thanh toán

interface NotificationItemProps {
  id: number;
  type: NotificationType;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  url?: string;
  status?: string;
  onPress?: () => void;
}

const notificationTypeMap: Record<
  NotificationType,
  {
    iconName: string;
    iconColor: string;
    bgColor: string;
  }
> = {
  new_order: {
    iconName: "shopping-bag",
    iconColor: Colors.primary,
    bgColor: Colors.primary_light,
  },
  order_status: {
    iconName: "package",
    iconColor: Colors.primary,
    bgColor: Colors.primary_light,
  },
  new_appointment: {
    iconName: "calendar",
    iconColor: Colors.secondary,
    bgColor: "#FFF5EE", // Light version of secondary
  },
  appointment_status: {
    iconName: "clock",
    iconColor: Colors.secondary,
    bgColor: "#FFF5EE",
  },
  new_review: {
    iconName: "star",
    iconColor: "#FFB800",
    bgColor: "#FFF8E7",
  },
  new_message: {
    iconName: "message-circle",
    iconColor: Colors.primary,
    bgColor: Colors.primary_light,
  },
  promotion: {
    iconName: "tag",
    iconColor: Colors.secondary,
    bgColor: "#FFF5EE",
  },
  system: {
    iconName: "alert-circle",
    iconColor: Colors.text,
    bgColor: Colors.grey70,
  },
  payment: {
    iconName: "credit-card",
    iconColor: Colors.primary,
    bgColor: Colors.primary_light,
  },
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  content,
  time,
  isRead,
  onPress,
}) => {
  const { iconName, iconColor, bgColor } =
    notificationTypeMap[type] || notificationTypeMap.system;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
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
                text70BO={!isRead}
                text70={isRead}
                color={isRead ? Colors.grey30 : Colors.text}
                numberOfLines={1}
              >
                {title}
              </Text>
              <Text flex-1 right text90 color={Colors.grey40} marginL-8>
                {time}
              </Text>
            </View>

            <Text
              text80
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
