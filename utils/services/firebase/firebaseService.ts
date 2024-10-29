import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as messaging from 'expo-firebase-messaging';
import AxiosInstance from '../helper/AxiosInstance';

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyDLAR58XAtHaXKhHJ_J15Kg_TOklESPBiw",
  authDomain: "allure-spa-app.firebaseapp.com",
  projectId: "allure-spa-app",
  storageBucket: "allure-spa-app.appspot.com",
  messagingSenderId: "150739207719",
  appId: "1:150739207719:web:xxxxxxxxxxxxxxxx",
  measurementId: "G-xxxxxxxxxx"
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

export const auth = getAuth();

export async function registerForPushNotifications() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return;
    }

    // Get Expo push token
    token = (await Notifications.getExpoPushTokenAsync()).data;
  }

  return token;
}

// Handle received messages
export function setupMessageListener(callback: (message: any) => void) {
  return Notifications.addNotificationReceivedListener(callback);
}

export async function setupChatMessageListener(chatId: string, callback: (message: any) => void) {
  // Request permission first
  const token = await registerForPushNotifications();

  if (!token) return;

  // Setup message listener for foreground messages
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    // Only process messages for this chat
    if (remoteMessage.data?.chatId === chatId) {
      callback(remoteMessage.data);
    }
  });

  // Setup background message handler
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    if (remoteMessage.data?.chatId === chatId) {
      callback(remoteMessage.data);
    }
  });

  return unsubscribe;
}

// Add function to send FCM token to server
export async function registerChatToken(userId: string) {
  const token = await registerForPushNotifications();

  if (token) {
    await AxiosInstance().post('/api/users/fcm-token', {
      user_id: userId,
      fcm_token: token,
      
    });
  }
}
