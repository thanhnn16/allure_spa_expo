import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ListItem,
  Colors,
} from "react-native-ui-lib";
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
    readIconColor: string;
  }
> = {
  new_order: {
    iconName: "shopping-bag",
    iconColor: "#2196F3",
    readIconColor: "#BDBDBD",
  },
  order_status: {
    iconName: "package",
    iconColor: "#2196F3",
    readIconColor: "#BDBDBD",
  },
  new_appointment: {
    iconName: "calendar",
    iconColor: "#4CAF50",
    readIconColor: "#BDBDBD",
  },
  appointment_status: {
    iconName: "clock",
    iconColor: "#FF9800",
    readIconColor: "#BDBDBD",
  },
  new_review: {
    iconName: "star",
    iconColor: "#FFC107",
    readIconColor: "#BDBDBD",
  },
  new_message: {
    iconName: "message-circle",
    iconColor: "#9C27B0",
    readIconColor: "#BDBDBD",
  },
  promotion: {
    iconName: "tag",
    iconColor: "#F44336",
    readIconColor: "#BDBDBD",
  },
  system: {
    iconName: "alert-circle",
    iconColor: "#607D8B",
    readIconColor: "#BDBDBD",
  },
  payment: {
    iconName: "credit-card",
    iconColor: "#4CAF50",
    readIconColor: "#BDBDBD",
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
  const { iconName, iconColor, readIconColor } =
    notificationTypeMap[type] || notificationTypeMap.system;

  return (
    <TouchableOpacity
      paddingH-16
      marginV-6
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        borderBottomWidth: 1,
        borderRadius: 20,
        borderBottomColor: Colors.grey70,
      }}
    >
      <ListItem
        height={88}
        paddingH-16
        paddingV-12
        style={{
          backgroundColor: isRead ? Colors.grey80 : Colors.white,
        }}
      >
        <ListItem.Part left marginR-12>
          <View
            width={36}
            height={36}
            br20
            center
            style={{
              backgroundColor: isRead ? Colors.grey80 : iconColor,
            }}
          >
            <Feather
              name={iconName as any}
              size={20}
              color={isRead ? readIconColor : Colors.white}
            />
          </View>
        </ListItem.Part>

        <ListItem.Part middle column>
          <View row spread centerV marginB-4>
            <Text
              text80
              color={Colors.grey20}
              style={{
                fontWeight: isRead ? "400" : "600",
                flex: 1,
                marginRight: 8,
              }}
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text text90 color={Colors.grey40}>
              {time}
            </Text>
          </View>
          <Text
            text80
            color={Colors.grey40}
            numberOfLines={2}
            style={{
              lineHeight: 20,
            }}
          >
            {content}
          </Text>
        </ListItem.Part>

        {!isRead && (
          <View
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              marginTop: -4,
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: Colors.primary,
            }}
          />
        )}
      </ListItem>
    </TouchableOpacity>
  );
};

export default NotificationItem;
