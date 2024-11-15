import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Notification } from "@/redux/features/notification/types";

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    loading: boolean;
    error: string | null;
}

const initialState: NotificationState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        setNotifications: (state: NotificationState, action: PayloadAction<Notification[]>) => {
            state.notifications = action.payload;
            state.unreadCount = action.payload.filter((n: Notification) => !n.isRead).length;
        },
        addNotification: (state: NotificationState, action: PayloadAction<Notification>) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.isRead) {
                state.unreadCount += 1;
            }
        },
        markAsRead: (state: NotificationState, action: PayloadAction<string>) => {
            const notification = state.notifications.find((n: Notification) => n.id === action.payload);
            if (notification && !notification.isRead) {
                notification.isRead = true;
                state.unreadCount -= 1;
            }
        },
        markAllAsRead: (state: NotificationState) => {
            state.notifications.forEach((n: Notification) => {
                n.isRead = true;
            });
            state.unreadCount = 0;
        },
        setLoading: (state: NotificationState, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setError: (state: NotificationState, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },
    },
});

export const {
    setNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    setLoading,
    setError,
} = notificationSlice.actions;

export default notificationSlice.reducer; 