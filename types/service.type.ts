import { Rating } from "react-native-ratings";
import { ResponeDefaultParams, ResponePagesParams, Timestamps } from "./commons.type";



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
    user_id: number;
    service_id: number;
    staff_user_id: number;
    start_time: string;
    end_time: string;
    actual_start_time: string;
    actual_end_time: string;
    appointment_type: string;
    status: string;
    note: string;
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
