import { Category } from "./category.type";
import { ResponePagesParams, ResponeDefaultParams, Timestamps } from "./commons.type";
import { Media } from "./media.type";
import { RatingSummary } from "./rating.type";
export interface Product extends Timestamps {
    id: number;
    name: string;
    price: number;
    category_id: number;
    quantity: number;
    brand_description: string;
    usage: string;
    benefits: string;
    key_ingredients: string;
    ingredients: string;
    directions: string;
    storage_instructions: string;
    is_favorite: boolean;
    product_notes: string;
    rating_summary: RatingSummary;
    category: Category;
    media: Media[];
    price_history: any[];
    attributes: any[];
}

export interface ProductResponseParams extends ResponeDefaultParams {
    success: boolean;
    data: Product;
}

export interface ProductsListResponseParams extends ResponeDefaultParams {
    data: {
        data: Product[];
    } & ResponePagesParams;
}
