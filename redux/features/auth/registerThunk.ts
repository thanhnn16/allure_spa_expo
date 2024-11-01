import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
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
      console.log('Register request body:', body);

      const res = await AxiosInstance().post<AuthResponse>('auth/register', {
        full_name: body.fullName,
        phone_number: body.phoneNumber,
        password: body.password,
        password_confirmation: body.confirmPassword
      });

      // Check if response is successful and contains data
      if (res.data.success && res.data.data) {
        const { token, user } = res.data.data;

        if (!token) {
          return rejectWithValue('No token received from server');
        }

        // Save token to AsyncStorage
        await AsyncStorage.setItem('userToken', token);

        // Register FCM token after successful registration
        await FirebaseService.requestUserPermission();
        await FirebaseService.registerTokenWithServer(user.id);

        console.log('Registration successful:', res.data);
        return {
          user: user,
          token: token
        };
      }

      console.log('Registration failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'An error occurred during registration';
      return rejectWithValue(errorMessage);
    }
  }
);