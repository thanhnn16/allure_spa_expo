import { ResponeDefaultParams, ResponePagesParams, Timestamps } from "./commons.type";
import { RatingSummary } from "@/types/rating.type";
import { User } from "./user.type";



export interface MediaResponeModelParams extends Timestamps {
    id: number;
    type: string;
    file_path: string;
    mediable_type: string;
    mediable_id: number;
    full_url: string;
    file_name: string;
    file_type: string;
    file_size: number;
}

export interface CategoryResponeModelParams extends Timestamps {
    id: number;
    name: string;
    parent_id: number;
    image_id: number;
}

export interface RatingResponeModelParams extends Timestamps {
    id: number;
    user_id: string,
    rating_type: string,
    item_id: number;
    stars: number;
    comment: string,
    image_id: number;
    video_id: number;
    status: string,
}

export interface AppointmentResponeModelParams extends Timestamps {
    id: number;
    title: string;
    user?: User;
    status: string;
    service: Service;
    start: string;
    end: string;
    price: number | null;
    staff: Staff;
    time_slot: TimeSlot;
    appointment_type: string;
    note: string;
    slots: number;
    cancelled_by: string | null;
    cancelled_at: string | null;
    cancellation_note: string | null;
    cancelled_by_user: CancelledByUser | null;
}

export interface ServiceResponeModel extends Timestamps {
    id: number;
    service_name: string;
    description: string;
    duration: number;
    category_id: number;
    single_price: number;
    combo_5_price: number;
    combo_10_price: number;
    validity_period: number;
    media: MediaResponeModelParams[];
    category: CategoryResponeModelParams;
    ratings: RatingResponeModelParams[];
    appointments: AppointmentResponeModelParams[]
}

export interface ServiceDetailResponeModel extends Timestamps, ResponeDefaultParams {
    id: number;
    service_name: string;
    description: string;
    duration: number;
    category_id: number;
    single_price: number;
    combo_5_price: number;
    rating_summary: RatingSummary;
    is_favorite: boolean;
    combo_10_price: number;
    validity_period: number;
    category: CategoryResponeModelParams;
    media: MediaResponeModelParams[];
    price_history: [];
}

export interface ServiceCategoriesModel {
    id: number;
    name: string;
    parent_id: number | null;
    image_id: number;
    children?: ServiceCategoriesModel[];
    services?: ServiceResponeModel[];
    image?: {
        id: number;
        url: string;
    };
    translations?: {
        id: number;
        service_category_id: number;
        locale: string;
        name: string;
    }[];
}

export interface ServiceCategoriesResponeParams extends ResponeDefaultParams {
    payload: any;
    data: ServiceCategoriesModel[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    next_page_url: string;
    path: string;
    per_page: number;
    prev_page_url: string | null,
    to: number;
    total: number;
}

export interface ServicesResponeParams extends ResponeDefaultParams, ResponePagesParams {
    data: {
        current_page: number;
        data: ServiceResponeModel[];
    }
}

export interface ServiceDetailResponeParams extends ResponeDefaultParams {
    data: ServiceDetailResponeModel
}

export interface Service {
    id: number;
    service_name: string;
    description: string;
    duration: number;
    category_id: number;
    single_price: number;
    combo_5_price: number;
    combo_10_price: number;
    validity_period: number;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
}

export interface TimeSlot {
    id: number;
    start_time: string;
    end_time: string;
    max_bookings: number;
}

export interface Staff {
    id: string;
    full_name: string;
}


export interface CancelledByUser {
    id: string;
    full_name: string;
}



