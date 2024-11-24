import { createAsyncThunk } from "@reduxjs/toolkit";
import FirebaseService from '@/utils/services/firebase/firebaseService';
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { clearUser } from "../users/userSlice";
import { clearNotifications } from "../notification/notificationSlice";
import { AUTH_ACTIONS } from './authActionTypes';

export const logoutThunk = createAsyncThunk(
    AUTH_ACTIONS.LOGOUT,
    async (_: any, { dispatch, rejectWithValue }: { dispatch: any, rejectWithValue: (value: any) => any }) => {
        try {
            const fcmToken = await FirebaseService.getFCMToken();

            if (fcmToken) {
                try {
                    await AxiosInstance().post('/auth/logout', {
                        fcm_token: fcmToken
                    });
                } catch (apiError) {
                    console.warn('Logout API call failed:', apiError);
                }
            }

            // Clear all state
            dispatch(clearUser());
            // We'll handle auth clearing through the reducer instead
            dispatch(clearNotifications());

            await AsyncStorage.multiRemove(['userToken', 'user', 'zaloTokens', 'isGuest']);
            return true;
        } catch (error: any) {
            console.error('Logout error:', error);
            await AsyncStorage.multiRemove(['userToken', 'user', 'zaloTokens', 'isGuest']);
            return rejectWithValue(error.message);
        }
    }
);

