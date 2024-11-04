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
      const res = await AxiosInstance().post<AuthResponse>('auth/login', {
        phone_number: body.phoneNumber,
        password: body.password
      });

      if (res.data.success && res.data.data) {
        const { token, user } = res.data.data;

        if (!token) {
          return rejectWithValue('No token received from server');
        }

        // Save token first
        await AsyncStorage.setItem('userToken', token);

        // Then handle FCM registration
        try {
          await FirebaseService.requestUserPermission();
          await FirebaseService.registerTokenWithServer(user.id);
        } catch (fcmError) {
          console.warn('FCM registration failed but login successful:', fcmError);
          // Continue with login even if FCM fails
        }

        return { user, token };
      }

      return rejectWithValue(res.data.message || 'Login failed');
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);




