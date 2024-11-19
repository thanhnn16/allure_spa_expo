import { createAsyncThunk } from '@reduxjs/toolkit';
import { NotificationResponse } from './types';
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
    async (_: any, { dispatch }: any) => {
        try {
            dispatch(setLoading(true));
            const response = await AxiosInstance().get<NotificationResponse>('/notifications');
            dispatch(setNotifications({
                items: response.data.data.data,
                hasMore: response.data.data.hasMore,
                unreadCount: response.data.data.data.filter(n => !n.is_read).length
            }));
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
    async (_: any, { dispatch, getState }: any) => {
        const state = getState() as RootState;
        const { currentPage, hasMore, loading } = state.notification;

        if (!hasMore || loading) return;

        try {
            dispatch(setLoading(true));
            const response = await AxiosInstance().get<NotificationResponse>('/notifications', {
                params: { page: currentPage + 1 }
            });
            dispatch(appendNotifications({
                items: response.data.data.data,
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
    async (_: any, { dispatch, getState }: any) => {
        const state = getState() as RootState;

        try {
            const response = await AxiosInstance().get('/notifications/unread-count');
            const newCount = response.data.data.count;

            if (newCount !== state.notification.unreadCount) {
                dispatch(setUnreadCount(newCount));
            }
            return newCount;
        } catch (error: any) {
            if (!error.message.includes('Network Error')) {
                dispatch(setError(error.message));
            }
            throw error;
        }
    },
    {
        condition: (_: any, { getState }: any) => {
            const state = getState() as RootState;
            return !state.notification.loading;
        }
    }
);

export const markNotificationAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (notificationId: number, { dispatch }: any) => {
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
    async (_: any, { dispatch }: any) => {
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