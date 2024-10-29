import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { UserRegisterResponseParams } from "@/types/user.type";
import FirebaseService from "@/utils/services/firebase/firebaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

      const res = await AxiosInstance().post<UserRegisterResponseParams>('auth/register', {
        full_name: body.fullName,
        phone_number: body.phoneNumber,
        password: body.password,
        password_confirmation: body.confirmPassword
      });

      if (res.data.success) {
        // Save token to AsyncStorage
        await AsyncStorage.setItem('userToken', res.data.token);

        // Register FCM token after successful registration
        await FirebaseService.requestUserPermission();
        await FirebaseService.registerTokenWithServer(res.data.user.id);

        console.log('Registration successful:', res.data);
        return res.data;
      }

      console.log('Registration failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      return rejectWithValue(error.data.message || 'An error occurred during registration');
    }
  }
);