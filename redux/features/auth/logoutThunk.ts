import { createAsyncThunk } from "@reduxjs/toolkit";
import FirebaseService from '@/utils/services/firebase/firebaseService';
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const logoutThunk = createAsyncThunk(
    'user/logout',
    async (_: any, { rejectWithValue }: any) => {
        try {
            // Get current FCM token
            const fcmToken = await FirebaseService.getFCMToken();

            // Call logout API with FCM token
            await AxiosInstance().post('/auth/logout', {
                fcm_token: fcmToken
            });

            // Clear local storage
            await AsyncStorage.multiRemove(['userToken']);

            return true;
        } catch (error: any) {
            console.error('Logout error:', error);
            return rejectWithValue(error.response?.data?.message || 'Logout failed');
        }
    }
);

