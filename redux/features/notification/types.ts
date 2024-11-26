import { NotificationType } from "@/components/notification/NotificationItem";

export interface Notification {
    id: number;
    title: string;
    content: string;
    type: NotificationType;
    is_read: boolean;
    created_at: string;
    url?: string;
    data?: any;
    media?: {
        id: number;
        url: string;
        type: string;
    };
    translations?: {
        title: Record<string, string>;
        content: Record<string, string>;
    };
    formatted_date: string;
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