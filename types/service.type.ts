import { ResponeDefaultParams, ResponePagesParams, Timestamps } from "./commons.type";

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
    data: ServiceCategoriesModel[]
}

export interface ServicesResponeParams extends ResponeDefaultParams, ResponePagesParams {
    data: {
        current_page: number;
        data: ServiceResponeModel[];
    }
}
