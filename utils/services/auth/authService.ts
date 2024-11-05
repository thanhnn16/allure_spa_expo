import AsyncStorage from '@react-native-async-storage/async-storage';
import AxiosInstance from '@/utils/services/helper/axiosInstance';
import FirebaseService from '@/utils/services/firebase/firebaseService';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth.type';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';

const TOKEN_KEY = '@auth_token';
const FCM_TOKEN_KEY = '@fcm_token';

class AuthService {
  private token: string | null = null;
  private fcmToken: string | null = null;
  private isRegistered: boolean = false;

  private async requestNotificationPermission() {
    if (Platform.OS === 'ios') {
      const authStatus = await messaging().requestPermission();
      return (
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL
      );
    }
    return true;
  }

  private async registerForRemoteMessages(retries = 3): Promise<boolean> {
    while (retries > 0) {
      try {
        if (!this.isRegistered) {
          await messaging().registerDeviceForRemoteMessages();
          this.isRegistered = true;
        }
        return true;
      } catch (error) {
        console.warn(`FCM registration attempt failed, retries left: ${retries - 1}`);
        retries--;
        if (retries === 0) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s before retry
      }
    }
    return false;
  }

  async initializeFCM() {
    try {
      const hasPermission = await this.requestNotificationPermission();
      if (!hasPermission) {
        throw new Error('Notification permission denied');
      }

      await this.registerForRemoteMessages();
      const token = await messaging().getToken();
      await this.setFCMToken(token);

      // Set up token refresh listener
      messaging().onTokenRefresh(async (newToken) => {
        await this.setFCMToken(newToken);
      });

      return token;
    } catch (error) {
      console.error('Failed to initialize FCM:', error);
      throw error;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const fcmToken = await this.initializeFCM();
      
      const response = await AxiosInstance().post<AuthResponse>('auth/login', {
        phone_number: credentials.phoneNumber,
        password: credentials.password,
        fcm_token: fcmToken // Send FCM token with login
      });

      if (response.data.success) {
        await this.setToken(response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    const response = await AxiosInstance().post<AuthResponse>('auth/register', {
      full_name: credentials.fullName,
      phone_number: credentials.phoneNumber,
      password: credentials.password,
      password_confirmation: credentials.confirmPassword
    });

    if (response.data.success) {
      await this.setToken(response.data.token);
    }

    return response.data;
  }

  async logout(): Promise<void> {
    try {
      const fcmToken = await AsyncStorage.getItem(FCM_TOKEN_KEY);
      await AxiosInstance().post('auth/logout', { fcm_token: fcmToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.multiRemove([TOKEN_KEY, FCM_TOKEN_KEY]);
      this.token = null;
      this.fcmToken = null;
    }
  }

  async zaloLogin(accessToken: string): Promise<AuthResponse> {
    const response = await AxiosInstance().post<AuthResponse>('auth/zalo/login', {
      access_token: accessToken
    });

    if (response.data.success) {
      await this.setToken(response.data.token);
    }

    return response.data;
  }

  async loginAsGuest(): Promise<void> {
    await AsyncStorage.setItem('isGuest', 'true');
  }

  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await AsyncStorage.getItem(TOKEN_KEY);
    }
    return this.token;
  }

  private async setToken(token: string): Promise<void> {
    this.token = token;
    await AsyncStorage.setItem(TOKEN_KEY, token);
  }

  private async setFCMToken(token: string): Promise<void> {
    this.fcmToken = token;
    await AsyncStorage.setItem(FCM_TOKEN_KEY, token);
    
    // If user is authenticated, update token on server
    const authToken = await this.getToken();
    if (authToken) {
      await AxiosInstance().put('/api/user/fcm-token', { fcm_token: token });
    }
  }

  private async removeToken(): Promise<void> {
    this.token = null;
    await AsyncStorage.removeItem(TOKEN_KEY);
  }
}

export default new AuthService(); 
