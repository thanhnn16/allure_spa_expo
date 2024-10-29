import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import FirebaseService from "@/utils/services/firebase/firebaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse } from "@/types/auth.type";

interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export const loginThunk = createAsyncThunk(
  'user/login',
  async (body: LoginRequest, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      console.log('Login request body:', body);

      const res = await AxiosInstance().post<AuthResponse>('auth/login', {
        phone_number: body.phoneNumber,
        password: body.password
      });

      console.log('Login response:', res.data);

      if (res.data.success && res.data.data) {
        const { token, user } = res.data.data;

        if (!token) {
          return rejectWithValue('No token received from server');
        }

        // Save token to AsyncStorage
        await AsyncStorage.setItem('userToken', token);

        // Register FCM token after successful login
        await FirebaseService.requestUserPermission();
        await FirebaseService.registerTokenWithServer(user.id);

        return {
          user: user,
          token: token
        };
      }

      console.log('Login failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Login failed');
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during login';
      return rejectWithValue(errorMessage);
    }
  }
);




