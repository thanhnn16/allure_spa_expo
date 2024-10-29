import { Timestamps } from "./commons.type";

export interface Category extends Timestamps {
    id: number;
    category_name: string;
    parent_id: number;
}