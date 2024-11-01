import { createAsyncThunk } from "@reduxjs/toolkit";
import FirebaseService from '@/utils/services/firebase/firebaseService';
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const logoutThunk = createAsyncThunk(
    'user/logout',
    async () => {
        try {
            // Get current FCM token
            const fcmToken = await FirebaseService.getFCMToken();

            // Get user token from AsyncStorage
            const userToken = await AsyncStorage.getItem('userToken');

            if (userToken) {
                // Call logout API with FCM token
                await AxiosInstance().post('/auth/logout', {
                    fcm_token: fcmToken
                });
            }

            // Clear local storage regardless of API call result
            await AsyncStorage.multiRemove(['userToken', 'user', 'zaloTokens', 'isGuest']);

            return true;
        } catch (error: any) {
            console.error('Logout error:', error);
            // Still clear storage even if API call fails
            await AsyncStorage.multiRemove(['userToken', 'user', 'zaloTokens', 'isGuest']);
            return true; // Return success anyway since we've cleared local storage
        }
    }
);

