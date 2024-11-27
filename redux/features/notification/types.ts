import { NotificationType } from "@/components/notification/NotificationItem";

export interface Notification {
    id: number;
    user_id: string;
    media_id?: number | null;
    title: string;
    content: string;
    type: NotificationType;
    is_read: boolean;
    url?: string | null;
    status: 'unseen' | 'seen';
    created_at: string | number;
    updated_at: string | number;
    media?: {
        id: number;
        url: string;
        type: string;
    } | null;
    translations?: {
        title: Record<string, string>;
        content: Record<string, string>;
    };
    created_at_timestamp: number;
    data?: Record<string, any>;
}

export interface NotificationResponse {
    message: string;
    status_code: number;
    success: boolean;
    data: {
        data: Notification[];
        hasMore: boolean;
    };
}

export interface UnreadCountResponse {
    data: {
        count: number;
    };
}