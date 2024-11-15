export interface Notification {
    id: number;
    title: string;
    content: string;
    type: string;
    is_read: boolean;
    url?: string;
    created_at: string;
    media?: {
        id: number;
        url: string;
        type: string;
    } | null;
    formatted_date: string;
}

export interface NotificationResponse {
    data: {
        items: Notification[];
        hasMore: boolean;
        unreadCount: number;
    };
}

export interface UnreadCountResponse {
    data: {
        count: number;
    };
}