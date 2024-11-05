import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import FirebaseService from "@/utils/services/firebase/firebaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse } from "@/types/auth.type";

interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export const registerThunk = createAsyncThunk(
  'user/register',
  async (body: RegisterRequest, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      const res = await AxiosInstance().post<AuthResponse>('auth/register', {
        full_name: body.fullName,
        phone_number: body.phoneNumber,
        password: body.password,
        password_confirmation: body.confirmPassword
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
          console.warn('FCM registration failed but registration successful:', fcmError);
          // Continue with registration even if FCM fails
        }

        return { user, token };
      }

      return rejectWithValue(res.data.message || 'Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);