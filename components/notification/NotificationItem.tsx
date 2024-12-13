import React from "react";
import { View, Text, TouchableOpacity, Colors } from "react-native-ui-lib";
import { Feather } from "@expo/vector-icons";
import { useTranslatedNotification } from "../../hooks/useTranslatedNotification";
import { handleNotificationNavigation } from "@/utils/services/notification/notificationHandler";

export type NotificationType =
  | "new_appointment"
  | "appointment_new"
  | "appointment_status"
  | "appointment_cancelled"
  | "appointment_reminder"
  | "new_order"
  | "order_new"
  | "order_status"
  | "order_cancelled"
  | "order_completed"
  | "service_expiring"
  | "service_low_sessions"
  | "service_completed"
  | "payment_success"
  | "payment_failed"
  | "payment_pending"
  | "new_message"
  | "new_review"
  | "promotion"
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
  appointment_new: {
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
  appointment_cancelled: {
    iconName: "x-circle",
    iconColor: Colors.red30,
    bgColor: "#FFEFEF",
    group: "appointment",
  },
  appointment_reminder: {
    iconName: "bell",
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
  order_new: {
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
  order_cancelled: {
    iconName: "x-circle",
    iconColor: Colors.red30,
    bgColor: "#FFEFEF",
    group: "order",
  },
  order_completed: {
    iconName: "check-circle",
    iconColor: Colors.green30,
    bgColor: "#E8F5E9",
    group: "order",
  },
  service_expiring: {
    iconName: "alert-triangle",
    iconColor: Colors.orange30,
    bgColor: "#FFF3E0",
    group: "service",
  },
  service_low_sessions: {
    iconName: "battery-low",
    iconColor: Colors.orange30,
    bgColor: "#FFF3E0",
    group: "service",
  },
  service_completed: {
    iconName: "check-circle",
    iconColor: Colors.green30,
    bgColor: "#E8F5E9",
    group: "service",
  },
  payment_success: {
    iconName: "credit-card",
    iconColor: Colors.green30,
    bgColor: "#E8F5E9",
    group: "payment",
  },
  payment_failed: {
    iconName: "credit-card",
    iconColor: Colors.red30,
    bgColor: "#FFEFEF",
    group: "payment",
  },
  payment_pending: {
    iconName: "credit-card",
    iconColor: Colors.orange30,
    bgColor: "#FFF3E0",
    group: "payment",
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
};

export const notificationTypeTranslations = {
  en: {
    new_appointment: "New Appointment",
    appointment_new: "New Appointment",
    appointment_status: "Appointment Status",
    appointment_cancelled: "Appointment Cancelled",
    appointment_reminder: "Appointment Reminder",
    new_order: "New Order",
    order_new: "New Order",
    order_status: "Order Status",
    order_cancelled: "Order Cancelled",
    order_completed: "Order Completed",
    service_expiring: "Service Expiring",
    service_low_sessions: "Low Sessions",
    service_completed: "Service Completed",
    payment_success: "Payment Success",
    payment_failed: "Payment Failed",
    payment_pending: "Payment Pending",
    new_message: "New Message",
    message_new: "New Message",
    new_review: "New Review",
    review_new: "New Review",
    promotion: "Promotion",
    system: "System",
  },
  vi: {
    new_appointment: "Lịch hẹn mới",
    appointment_new: "Lịch hẹn mới",
    appointment_status: "Trạng thái lịch hẹn",
    appointment_cancelled: "Lịch hẹn đã hủy",
    appointment_reminder: "Nhắc nhở lịch hẹn",
    new_order: "Đơn hàng mới",
    order_new: "Đơn hàng mới",
    order_status: "Trạng thái đơn hàng",
    order_cancelled: "Đơn hàng đã hủy",
    order_completed: "Đơn hàng hoàn thành",
    service_expiring: "Dịch vụ sắp hết hạn",
    service_low_sessions: "Số buổi còn lại thấp",
    service_completed: "Dịch vụ hoàn thành",
    payment_success: "Thanh toán thành công",
    payment_failed: "Thanh toán thất bại",
    payment_pending: "Chờ thanh toán",
    new_message: "Tin nhắn mới",
    message_new: "Tin nhắn mới",
    new_review: "Đánh giá mới",
    review_new: "Đánh giá mới",
    promotion: "Khuyến mãi",
    system: "Hệ thống",
  },
  ja: {
    new_appointment: "新しい予約",
    appointment_new: "新しい予約",
    appointment_status: "予約状態",
    appointment_cancelled: "予約キャンセル",
    appointment_reminder: "予約リマインダー",
    new_order: "新規注文",
    order_new: "新規注文",
    order_status: "注文状態",
    order_cancelled: "注文キャンセル",
    order_completed: "注文完了",
    service_expiring: "サービス期限切れ",
    service_low_sessions: "残りセッション数が少ない",
    service_completed: "サービス完了",
    payment_success: "支払い成功",
    payment_failed: "支払い失敗",
    payment_pending: "支払い保留",
    new_message: "新しいメッセージ",
    message_new: "新しいメッセージ",
    new_review: "新しいレビュー",
    review_new: "新しいレビュー",
    promotion: "プロモーション",
    system: "システム",
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
    user_id: "",
    status: "unseen",
    updated_at: "",
    created_at_timestamp: 0,
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
