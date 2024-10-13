import { ResponeDefaultParams, ResponePagesParams, Timestamps } from "./commons.type";

export interface TreatmentResponeModel extends Timestamps {
    id: number;
    name: string;
    price: number;
    description: string;
    duration: number;
    image_id: number;
    category_id: number;
}
export interface TreatmentCategoriesModel {
    id: number;
    category_name: string;
}

export interface TreatmentCategoriesRespone extends ResponeDefaultParams {
    data: TreatmentCategoriesModel[]
}

export interface TreatmentsResponeParams extends ResponeDefaultParams, ResponePagesParams {
    data: {
        current_page: number;
        data: TreatmentResponeModel[];
    }
}
