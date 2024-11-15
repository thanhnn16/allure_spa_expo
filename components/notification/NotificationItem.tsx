import React from "react";
import { Image } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  ListItem,
  Colors,
} from "react-native-ui-lib";

export type NotificationType = 
  | 'new_order'           // Đơn hàng mới
  | 'order_status'        // Cập nhật trạng thái đơn hàng
  | 'new_appointment'     // Lịch hẹn mới
  | 'appointment_status'  // Cập nhật trạng thái lịch hẹn
  | 'new_review'         // Đánh giá mới
  | 'new_message'        // Tin nhắn mới
  | 'promotion'          // Khuyến mãi
  | 'system'             // Thông báo hệ thống
  | 'payment';           // Thanh toán

interface NotificationItemProps {
  id: string;
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
  { backgroundColor: string; icon: any }
> = {
  new_order: {
    backgroundColor: Colors.blue30,
    icon: require("@/assets/images/home/icons/order.png"),
  },
  order_status: {
    backgroundColor: Colors.blue30,
    icon: require("@/assets/images/home/icons/order-status.png"),
  },
  new_appointment: {
    backgroundColor: Colors.green30,
    icon: require("@/assets/images/home/icons/calendartick.png"),
  },
  appointment_status: {
    backgroundColor: Colors.orange30,
    icon: require("@/assets/images/home/icons/calendaredit.png"),
  },
  new_review: {
    backgroundColor: Colors.yellow30,
    icon: require("@/assets/images/home/icons/star.png"),
  },
  new_message: {
    backgroundColor: Colors.purple30,
    icon: require("@/assets/images/home/icons/message.png"),
  },
  promotion: {
    backgroundColor: Colors.red30,
    icon: require("@/assets/images/home/icons/promotion.png"),
  },
  system: {
    backgroundColor: Colors.gray30,
    icon: require("@/assets/images/home/icons/system.png"),
  },
  payment: {
    backgroundColor: Colors.green30,
    icon: require("@/assets/images/home/icons/payment.png"),
  }
};

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  content,
  time,
  isRead,
  onPress,
}) => {
  const { backgroundColor, icon } = notificationTypeMap[type] || notificationTypeMap.system;

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
          <View 
            width={48} 
            height={48} 
            br100 
            center
            style={{ backgroundColor }}
          >
            <Image 
              source={icon} 
              style={{
                width: 32,
                height: 32,
                tintColor: Colors.white
              }} 
            />
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
