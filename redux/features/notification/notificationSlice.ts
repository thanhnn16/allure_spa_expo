import { createSlice } from "@reduxjs/toolkit";
import { Notification } from "./types";
import { fetchNotifications } from "./notificationThunks";

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
        setNotifications: (state: NotificationState, action: any) => {
            state.notifications = action.payload.items;
            state.hasMore = action.payload.hasMore;
            if (typeof action.payload.unreadCount === 'number') {
                state.unreadCount = action.payload.unreadCount;
            }
        },
        appendNotifications: (state: NotificationState, action: any) => {
            state.notifications = [...state.notifications, ...action.payload.items];
            state.hasMore = action.payload.hasMore;
            state.currentPage += 1;
        },
        markAsRead: (state: NotificationState, action: any) => {
            const notification = state.notifications.find(n => n.id === action.payload);
            if (notification && !notification.is_read) {
                notification.is_read = true;
                state.unreadCount = Math.max(0, state.unreadCount - 1);
            }
        },
        markAllAsRead: (state: NotificationState) => {
            state.notifications = state.notifications.map(notification => ({
                ...notification,
                is_read: true
            }));
            state.unreadCount = 0;
        },
        setLoading: (state: NotificationState, action: any) => {
            state.loading = action.payload;
        },
        setError: (state: NotificationState, action: any) => {
            state.error = action.payload;
        },
        setUnreadCount: (state: NotificationState, action: any) => {
            if (typeof action.payload === 'number' && action.payload >= 0) {
                state.unreadCount = action.payload;
            }
        },
        clearNotifications: (state: NotificationState) => {
            state.notifications = [];
            state.unreadCount = 0;
            state.hasMore = false;
            state.currentPage = 1;
        },
    },
    extraReducers: (builder: any) => {
        builder.addCase(fetchNotifications.pending, (state: NotificationState) => {
            state.loading = true;
        });
        builder.addCase(fetchNotifications.fulfilled, (state: NotificationState, action: any) => {
            state.loading = false;
            state.notifications = action.payload?.data || [];
            state.hasMore = action.payload?.hasMore || false;
            state.unreadCount = (action.payload?.data || []).filter((n: Notification) => !n.is_read).length;
        });
        builder.addCase(fetchNotifications.rejected, (state: NotificationState, action: any) => {
            state.loading = false;
            state.error = action.error.message;
        });
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
    clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer; 