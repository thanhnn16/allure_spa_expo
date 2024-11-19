import { Timestamps } from "./commons.type";

export interface Banner extends Timestamps {
    id: number;
    title: string;
    description: string;
    full_image_url: string;
    image_url: string;
    link_url: string | null;
    start_date: string | null;
    end_date: string | null;
    is_active: boolean;
    order: number;
    created_at: string;
    updated_at: string;

}
