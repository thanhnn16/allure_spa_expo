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