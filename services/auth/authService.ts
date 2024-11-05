import AsyncStorage from '@react-native-async-storage/async-storage';
import FirebaseService from '@/utils/services/firebase/firebaseService';
import { AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth.type';
import AxiosInstance from '@/utils/services/helper/AxiosInstance';

class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await AxiosInstance().post<AuthResponse>('auth/login', {
            phone_number: credentials.phoneNumber,
            password: credentials.password
        });

        if (response.data.success) {
            await this.handleSuccessfulAuth(response.data);
        }

        return response.data;
    }

    async register(credentials: RegisterCredentials): Promise<AuthResponse> {
        const response = await AxiosInstance().post<AuthResponse>('auth/register', {
            full_name: credentials.fullName,
            phone_number: credentials.phoneNumber,
            password: credentials.password,
            password_confirmation: credentials.confirmPassword
        });

        if (response.data.success) {
            await this.handleSuccessfulAuth(response.data);
        }

        return response.data;
    }

    async logout(fcmToken?: string): Promise<void> {
        try {
            if (fcmToken) {
                await AxiosInstance().post('/auth/logout', { fcm_token: fcmToken });
            }
            await this.clearAuthData();
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }

    async zaloLogin(accessToken: string): Promise<AuthResponse> {
        const response = await AxiosInstance().post<AuthResponse>('auth/zalo/login', {
            access_token: accessToken
        });

        if (response.data.success) {
            await this.handleSuccessfulAuth(response.data);
        }

        return response.data;
    }
    async getUser(): Promise<AuthResponse> {
        const response = await AxiosInstance().get<AuthResponse>('user/info');
        if (response.data.success) {
          await this.handleSuccessfulAuth(response.data);
        }
    
        return response.data;
      }
      async updateProfile(data: any): Promise<AuthResponse> {
        const response = await AxiosInstance().put<AuthResponse>(`users/${data.id}`, data);
        if (response.data.success) {
          await this.handleSuccessfulAuth(response.data);
        }
    
        return response.data;
      }
    
      async updateAvatar(data: any): Promise<AuthResponse> {
        const response = await AxiosInstance().put<AuthResponse>('user/avatar', data);
        if (response.data.success) {
          await this.handleSuccessfulAuth(response.data);
        }
    
        return response.data;
      }
    private async handleSuccessfulAuth(data: AuthResponse): Promise<void> {
        await AsyncStorage.setItem('userToken', data.token);
        await FirebaseService.requestUserPermission();
        await FirebaseService.registerTokenWithServer(data.user.id);
    }

    private async clearAuthData(): Promise<void> {
        await AsyncStorage.multiRemove(['userToken']);
    }
}

export default new AuthService(); 
