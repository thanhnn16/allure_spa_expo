export interface Timestamps {
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface ResponeDefaultParams {
    message: string;
    status_code: Number;
    success: boolean;
}

export interface ResponePagesParams {
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}