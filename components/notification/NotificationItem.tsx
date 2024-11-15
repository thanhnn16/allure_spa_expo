import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ListItem,
  Colors,
} from "react-native-ui-lib";
import {
  MaterialCommunityIcons,
  MaterialIcons,
  Ionicons,
} from "@expo/vector-icons";

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
    backgroundColor: string;
    iconName: string;
    iconFamily: "MaterialCommunityIcons" | "MaterialIcons" | "Ionicons";
  }
> = {
  new_order: {
    backgroundColor: Colors.blue30,
    iconName: "shopping-cart",
    iconFamily: "MaterialIcons",
  },
  order_status: {
    backgroundColor: Colors.blue30,
    iconName: "clipboard-list",
    iconFamily: "MaterialCommunityIcons",
  },
  new_appointment: {
    backgroundColor: Colors.green30,
    iconName: "calendar-check",
    iconFamily: "MaterialCommunityIcons",
  },
  appointment_status: {
    backgroundColor: Colors.orange30,
    iconName: "calendar-edit",
    iconFamily: "MaterialCommunityIcons",
  },
  new_review: {
    backgroundColor: Colors.yellow30,
    iconName: "star",
    iconFamily: "MaterialIcons",
  },
  new_message: {
    backgroundColor: Colors.purple30,
    iconName: "message",
    iconFamily: "MaterialIcons",
  },
  promotion: {
    backgroundColor: Colors.red30,
    iconName: "local-offer",
    iconFamily: "MaterialIcons",
  },
  system: {
    backgroundColor: Colors.gray30,
    iconName: "settings",
    iconFamily: "MaterialIcons",
  },
  payment: {
    backgroundColor: Colors.green30,
    iconName: "payment",
    iconFamily: "MaterialIcons",
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
  const { backgroundColor, iconName, iconFamily } =
    notificationTypeMap[type] || notificationTypeMap.system;

  const renderIcon = () => {
    switch (iconFamily) {
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={iconName as any}
            size={24}
            color={Colors.white}
          />
        );
      case "MaterialIcons":
        return (
          <MaterialIcons
            name={iconName as any}
            size={24}
            color={Colors.white}
          />
        );
      case "Ionicons":
        return (
          <Ionicons name={iconName as any} size={24} color={Colors.white} />
        );
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <ListItem
        marginV-8
        paddingH-24
        paddingV-12
        style={{
          backgroundColor: isRead ? Colors.white : Colors.grey70,
        }}
      >
        <ListItem.Part left>
          <View width={48} height={48} br100 center style={{ backgroundColor }}>
            {renderIcon()}
          </View>
        </ListItem.Part>
        <ListItem.Part
          middle
          column
          containerStyle={{ paddingLeft: 16, flexShrink: 1 }}
        >
          <View row spread centerV>
            <Text
              h3
              color={Colors.text}
              style={{ fontWeight: isRead ? "400" : "700" }}
            >
              {title}
            </Text>
            <Text h3 color={Colors.gray}>
              {time}
            </Text>
          </View>
          <Text h3 color={Colors.gray} numberOfLines={2}>
            {content}
          </Text>
        </ListItem.Part>
      </ListItem>
    </TouchableOpacity>
  );
};

export default NotificationItem;
