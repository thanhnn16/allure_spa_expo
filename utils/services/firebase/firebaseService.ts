import messaging from '@react-native-firebase/messaging';
import AxiosInstance from '../helper/axiosInstance';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

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
      console.log('FCM token:', fcmToken);
      return fcmToken;
    } catch (error) {
      console.log('Failed to get FCM token:', error);
      return null;
    }
  }

  async registerTokenWithServer(userId: string) {
    try {
      const fcmToken = await this.getFCMToken();
      if (fcmToken) {
        const response = await AxiosInstance().post('/auth/fcm-token', {
          token: fcmToken,
          device_type: Platform.OS
        });
        console.log('FCM token registered successfully:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('Failed to register token with server:', error);
      throw error;
    }
  }

  async setupNotifications() {
    // Cấu hình thông báo cho ứng dụng
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
    });
  }

  setupMessageHandlers() {
    // Xử lý tin nhắn khi ứng dụng ở background
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background:', remoteMessage);
      if (remoteMessage.data?.type === 'chat_message') {
        await this.showChatNotification(remoteMessage);
      }
    });

    // Xử lý tin nhắn khi ứng dụng đang mở
    return messaging().onMessage(async remoteMessage => {
      console.log('Received foreground message:', remoteMessage);
      if (remoteMessage.data?.type === 'chat_message') {
        await this.showChatNotification(remoteMessage);
        return remoteMessage;
      }
    });
  }

  async showChatNotification(remoteMessage: any) {
    try {
      const uniqueId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await Notifications.scheduleNotificationAsync({
        content: {
          title: remoteMessage.notification?.title || "Tin nhắn mới",
          body: remoteMessage.notification?.body || remoteMessage.data?.message,
          data: {
            ...remoteMessage.data,
            uniqueId,
          },
        },
        trigger: null,
      });
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  }
}

export default FirebaseService.getInstance();
