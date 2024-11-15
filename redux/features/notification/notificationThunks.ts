import { createAsyncThunk } from '@reduxjs/toolkit';
import { Notification } from './types';
import { setNotifications, setLoading, setError, markAsRead, markAllAsRead } from './notificationSlice';
import AxiosInstance from "@/utils/services/helper/axiosInstance";


export const fetchNotifications = createAsyncThunk(
    'notification/fetchNotifications',
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const response = await AxiosInstance().get<Notification[]>('/notifications');
            const notifications = response.data.data || [];
            dispatch(setNotifications(notifications));
            return notifications;
        } catch (error: any) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (notificationId: string, { dispatch }) => {
        try {
            await AxiosInstance().post(`/notifications/${notificationId}/read`);
            dispatch(markAsRead(notificationId));
        } catch (error: any) {
            dispatch(setError(error.message));
            throw error;
        }
    }
);

export const markAllNotificationsAsRead = createAsyncThunk(
    'notification/markAllAsRead',
    async (_, { dispatch }) => {
        try {
            await AxiosInstance().post('/notifications/read-all');
            dispatch(markAllAsRead());
        } catch (error: any) {
            dispatch(setError(error.message));
            throw error;
        }
    }
); 