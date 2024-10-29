import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors, Text, View } from "react-native-ui-lib";
import AppBar from "@/components/app-bar/AppBar";
import NotificationItem from "@/components/notification/NotificationItem";
import { FlatList } from "react-native";
import i18n from "@/languages/i18n";

// Types
type NotificationType = "success" | "cancel" | "reschedule";

interface Notification {
  id: string;
  title: string;
  content: string;
  time: string;
  type: NotificationType;
  isRead: boolean;
}

// Data
const notificationData: Notification[] = [
  {
    id: "1",
    title: i18n.t('notification.order_success'),
    content: i18n.t('notification.order_success_content'),
    time: i18n.t('notification.time_ago', { time: '1h' }),
    type: "success",
    isRead: false,
  },
  {
    id: "2",
    title: i18n.t('notification.appointment_cancelled'),
    content: i18n.t('notification.appointment_cancelled_content'),
    time: i18n.t('notification.time_ago', { time: '2h' }),
    type: "cancel",
    isRead: true,
  },
  {
    id: "3",
    title: i18n.t('notification.appointment_rescheduled'),
    content: i18n.t('notification.appointment_rescheduled_content'),
    time: i18n.t('notification.time_ago', { time: '3h' }),
    type: "reschedule",
    isRead: true,
  },
];

const NotificationPage: React.FC = () => {
  const handleNotificationPress = (id: string) => {
    console.log(`Notification ${id} pressed`);
  };

  const renderItem = ({ item }: { item: Notification }) => (
    <NotificationItem
      id={item.id}
      type={item.type}
      title={item.title}
      content={item.content}
      time={item.time}
      isRead={item.isRead}
      onPress={() => handleNotificationPress(item.id)}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View flex bg-white>
        <AppBar back title={i18n.t('notification.title')} />
        <View flex>
          <View row spread centerV padding-8 paddingH-24>
            <Text h3 color={Colors.gray}>
              {i18n.t('notification.today')}
            </Text>
            <Text h3>{i18n.t('notification.mark_all_read')}</Text>
          </View>
          <FlatList
            data={notificationData}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingVertical: 8 }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default NotificationPage;
