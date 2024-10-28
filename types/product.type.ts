import { Category } from "./category.type";
import { Timestamps } from "./commons.type";
import { Media } from "./media.type";

export interface Product extends Timestamps {
    id: number;
    name: string;
    price: string;
    category_id: number;
    quantity: number;
    brand_description: string;
    usage: string;
    benefits: string;
    key_ingredients: string;
    ingredients: string;
    directions: string;
    storage_instructions: string;
    product_notes: string;
    category: Category;
    media: Media[];
    price_history: any[];
    attributes: any[];
}

export interface ProductResponseParams {
    message: string;
    status_code: number;
    success: boolean;
    data: Product;
}