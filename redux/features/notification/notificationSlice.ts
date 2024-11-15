import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "./types";

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    hasMore: boolean;
    currentPage: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    hasMore: false,
    currentPage: 1,
    loading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotifications: (state, action: PayloadAction<{
            items: Notification[];
            hasMore: boolean;
            unreadCount: number;
        }>) => {
            state.notifications = action.payload.items;
            state.hasMore = action.payload.hasMore;
            state.unreadCount = action.payload.unreadCount;
        },
        appendNotifications: (state, action: PayloadAction<{
            items: Notification[];
            hasMore: boolean;
        }>) => {
            state.notifications = [...state.notifications, ...action.payload.items];
            state.hasMore = action.payload.hasMore;
            state.currentPage += 1;
        },
        markAsRead: (state, action: PayloadAction<number>) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.is_read) {
                notification.is_read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state) => {
            state.notifications.forEach(n => {
                n.is_read = true;
            });
            state.unreadCount = 0;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
        setUnreadCount: (state, action: PayloadAction<number>) => {
            state.unreadCount = action.payload;
        },
    },
});

export const {
    setNotifications,
    appendNotifications,
    markAsRead,
    markAllAsRead,
    setLoading,
    setError,
    setUnreadCount,
} = notificationSlice.actions;

export default notificationSlice.reducer; 