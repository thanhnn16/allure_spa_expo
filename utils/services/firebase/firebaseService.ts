import messaging from '@react-native-firebase/messaging';
import AxiosInstance from '../helper/axiosInstance';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useDispatch } from 'react-redux';
import { fetchUnreadCount } from '@/redux/features/notification/notificationThunks';
import { AppDispatch } from '@/redux/store';
import { BACKGROUND_NOTIFICATION_TASK, setupNotificationHandler } from '@/utils/services/notification/notificationHandler';

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
    // Thiết lập notification handler
    setupNotificationHandler();

    // Đăng ký task xử lý background notification
    await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
  }

  async handleNotification(remoteMessage: any) {
    const uniqueId = remoteMessage.data?.notification_id || `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const existingNotifications = await Notifications.getAllScheduledNotificationsAsync();
    const isDuplicate = existingNotifications.some(
        notification => notification.content.data?.notification_id === uniqueId
    );
    
    if (isDuplicate) return;

    const notificationData = {
        title: remoteMessage.notification?.title || "Thông báo mới",
        body: remoteMessage.notification?.body,
        data: {
            ...remoteMessage.data,
            notification_id: uniqueId,
            type: remoteMessage.data?.type,
        },
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
    };

    await Notifications.scheduleNotificationAsync({
        content: notificationData,
        trigger: null,
    });

    if (remoteMessage.data?.should_update_count) {
        await this.updateUnreadCount();
    }
  }

  async updateUnreadCount() {
    const store = require('@/redux/store').default;
    store.dispatch(fetchUnreadCount());
  }

  setupMessageHandlers() {
    // Background messages
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      await this.handleNotification(remoteMessage);
    });

    // Foreground messages
    return messaging().onMessage(async remoteMessage => {
      await this.handleNotification(remoteMessage);
      return remoteMessage;
    });
  }
}

export default FirebaseService.getInstance();
