import messaging from '@react-native-firebase/messaging';
import AxiosInstance from '../helper/axiosInstance';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useDispatch } from 'react-redux';
import { fetchUnreadCount } from '@/redux/features/notification/notificationThunks';
import { AppDispatch } from '@/redux/store';

class FirebaseService {
  private static instance: FirebaseService;

  private constructor() { }

  public static getInstance(): FirebaseService {
    if (!FirebaseService.instance) {
      FirebaseService.instance = new FirebaseService();
    }
    return FirebaseService.instance;
  }

  async requestUserPermission() {
    if (!Device.isDevice) return null;

    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return null;
    }

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      return this.getFCMToken();
    }

    return null;
  }

  async getFCMToken() {
    try {
      const fcmToken = await messaging().getToken();
      return fcmToken;
    } catch (error) {
      return null;
    }
  }

  async registerTokenWithServer() {
    try {
      const fcmToken = await this.getFCMToken();
      if (fcmToken) {
        const response = await AxiosInstance().post('/auth/fcm-token', {
          token: fcmToken,
          device_type: Platform.OS
        });
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  }

  async setupNotifications() {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        return {
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        };
      },
    });
  }

  setupMessageHandlers() {
    // Xử lý tin nhắn khi ứng dụng ở background
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      const dispatch = useDispatch<AppDispatch>();
      dispatch(fetchUnreadCount());
      if (remoteMessage.data?.type === 'chat_message') {
        await this.showChatNotification(remoteMessage);
      }
      if (remoteMessage.data?.type === 'appointment') {
        await this.showAppointmentNotification(remoteMessage);
      }
    });

    // Xử lý tin nhắn khi ứng dụng đang mở
    return messaging().onMessage(async remoteMessage => {
      console.log('Received foreground message:', remoteMessage);
      remoteMessage.data = {
        ...remoteMessage.data,
        foreground: 'true'
      };

      if (remoteMessage.data?.type === 'chat_message') {
        await this.showChatNotification(remoteMessage);
      }
      if (remoteMessage.data?.type === 'appointment') {
        await this.showAppointmentNotification(remoteMessage);
        return remoteMessage;
      }
      if (remoteMessage.data?.type === 'order') {
        await this.showOrderNotification(remoteMessage);
      }
      if (remoteMessage.data?.type === 'payment_success') {
        await this.showPaymentNotification(remoteMessage);
      }
      return remoteMessage;
    });
  }

  async showAppointmentNotification(remoteMessage: any) {
    try {
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const isAppForeground = remoteMessage.data?.foreground === 'true';

      let title = remoteMessage.notification?.title || "Thông báo lịch hẹn";
      let body = remoteMessage.notification?.body;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            ...remoteMessage.data,
            uniqueId,
            type: 'appointment',
            isForeground: isAppForeground,
          },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing appointment notification:', error);
    }
  }

  async showChatNotification(remoteMessage: any) {
    try {
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const isAppForeground = remoteMessage.data?.foreground === 'true';

      let title = remoteMessage.notification?.title || "Tin nhắn mới";
      let body = remoteMessage.notification?.body;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            ...remoteMessage.data,
            uniqueId,
            type: 'chat_message',
            isForeground: isAppForeground,
          },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing chat notification:', error);
    }
  }

  async showOrderNotification(remoteMessage: any) {
    try {
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      let title = remoteMessage.notification?.title || "Thông báo đơn hàng";
      let body = remoteMessage.notification?.body;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            ...remoteMessage.data,
            uniqueId,
            type: 'order'
          },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing order notification:', error);
    }
  }

  async showPaymentNotification(remoteMessage: any) {
    try {
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const isAppForeground = remoteMessage.data?.foreground === 'true';

      let title = remoteMessage.notification?.title || "Thông báo thanh toán";
      let body = remoteMessage.notification?.body;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: {
            ...remoteMessage.data,
            uniqueId,
            type: 'payment_success',
            isForeground: isAppForeground,
          },
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing payment notification:', error);
    }
  }
}

export default FirebaseService.getInstance();
