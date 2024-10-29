import messaging from '@react-native-firebase/messaging';
import AxiosInstance from '../helper/AxiosInstance';
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
      return fcmToken;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  async registerTokenWithServer(userId: string) {
    try {
      const token = await this.getFCMToken();
      if (token) {
        await AxiosInstance().post('/users/fcm-token', {
          user_id: userId,
          token: token,
          device_type: Platform.OS
        });
      }
    } catch (error) {
      console.error('Failed to register token with server:', error);
    }
  }

  setupMessageHandlers() {
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background:', remoteMessage);
      
      if (remoteMessage.data?.type === 'chat_message') {
        this.showChatNotification(remoteMessage);
      }
    });

    return messaging().onMessage(async remoteMessage => {
      console.log('Received foreground message:', remoteMessage);
      
      if (remoteMessage.data?.type === 'chat_message') {
        return remoteMessage;
      }
    });
  }

  private showChatNotification(remoteMessage: any) {
    // Show local notification when app is in background
    // You may want to use a notification library like notifee here
  }
}

export default FirebaseService.getInstance();
