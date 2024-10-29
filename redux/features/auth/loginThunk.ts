import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { UserLoginResponseParams } from "@/types/user.type";
import FirebaseService from "@/utils/services/firebase/firebaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export const loginThunk = createAsyncThunk(
  'user/login',
  async (body: LoginRequest, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
    try {
      console.log('Login request body:', body);

      const res = await AxiosInstance().post<UserLoginResponseParams>('auth/login', {
        phone_number: body.phoneNumber,
        password: body.password
      });

      if (res.data.success) {
        // Save token to AsyncStorage
        await AsyncStorage.setItem('userToken', res.data.token);

        // Register FCM token after successful login
        await FirebaseService.requestUserPermission();
        await FirebaseService.registerTokenWithServer(res.data.user.id);

        console.log('Login successful:', res.data);
        return res.data;
      }

      console.log('Login failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Login failed');
    } catch (error: any) {
      console.error('Login error:', error);
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);




