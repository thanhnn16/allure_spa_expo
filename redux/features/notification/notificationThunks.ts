import { createAsyncThunk } from '@reduxjs/toolkit';
import { Notification, NotificationResponse } from './types';
import {
    setNotifications,
    appendNotifications,
    setLoading,
    setError,
    setUnreadCount,
    markAsRead as markAsReadAction,
    markAllAsRead as markAllAsReadAction
} from './notificationSlice';
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { RootState } from '@/redux/store';

export const fetchNotifications = createAsyncThunk(
    'notification/fetchNotifications',
    async (_, { dispatch }) => {
        try {
            dispatch(setLoading(true));
            const response = await AxiosInstance().get<NotificationResponse>('/notifications');
            dispatch(setNotifications(response.data.data));
            return response.data.data;
        } catch (error: any) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
);

export const loadMoreNotifications = createAsyncThunk(
    'notification/loadMore',
    async (_, { dispatch, getState }) => {
        const state = getState() as RootState;
        const { currentPage, hasMore, loading } = state.notification;

        if (!hasMore || loading) return;

        try {
            dispatch(setLoading(true));
            const response = await AxiosInstance().get<NotificationResponse>('/notifications', {
                params: { page: currentPage + 1 }
            });
            dispatch(appendNotifications({
                items: response.data.data.items,
                hasMore: response.data.data.hasMore
            }));
        } catch (error: any) {
            dispatch(setError(error.message));
            throw error;
        } finally {
            dispatch(setLoading(false));
        }
    }
);

export const fetchUnreadCount = createAsyncThunk(
    'notification/fetchUnreadCount',
    async (_, { dispatch }) => {
        try {
            const response = await AxiosInstance().get('/notifications/unread-count');
            dispatch(setUnreadCount(response.data.data.count));
            return response.data.data.count;
        } catch (error: any) {
            dispatch(setError(error.message));
            throw error;
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (notificationId: number, { dispatch }) => {
        try {
            await AxiosInstance().post(`/notifications/${notificationId}/mark-as-read`);
            dispatch(markAsReadAction(notificationId));
            dispatch(fetchUnreadCount());
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
            await AxiosInstance().post('/notifications/mark-all-as-read');
            dispatch(markAllAsReadAction());
            dispatch(setUnreadCount(0));
        } catch (error: any) {
            dispatch(setError(error.message));
            throw error;
        }
    }
); 