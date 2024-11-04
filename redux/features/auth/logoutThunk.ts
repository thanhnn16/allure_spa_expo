import { createAsyncThunk } from "@reduxjs/toolkit";
import FirebaseService from '@/utils/services/firebase/firebaseService';
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const logoutThunk = createAsyncThunk(
    'user/logout',
    async (_: any, { rejectWithValue }: { rejectWithValue: (value: any) => any }) => {
        try {
            const fcmToken = await FirebaseService.getFCMToken();

            if (fcmToken) {
                try {
                    await AxiosInstance().post('/auth/logout', {
                        fcm_token: fcmToken
                    });
                } catch (apiError) {
                    console.warn('Logout API call failed:', apiError);
                    // Continue with local cleanup even if API fails
                }
            }

            // Always clear local storage
            await AsyncStorage.multiRemove(['userToken', 'user', 'zaloTokens', 'isGuest']);
            return true;
        } catch (error: any) {
            console.error('Logout error:', error);
            // Still try to clear storage on error
            await AsyncStorage.multiRemove(['userToken', 'user', 'zaloTokens', 'isGuest']);
            return rejectWithValue(error.message);
        }
    }
);

