import { Category } from "./category.type";
import { ResponePagesParams, ResponeDefaultParams, Timestamps } from "./commons.type";
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
    rating_summary: RatingSummary;
    category: Category;
    media: Media[];
    price_history: any[];
    attributes: any[];
}

export interface RatingSummary {
    average_rating: number;
    total_ratings: number;
    rating_distribution: RatingDistribution;
  }

export interface RatingDistribution {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  }

export interface ProductResponseParams extends ResponeDefaultParams {
    data: Product;
}

export interface ProductsListResponseParams extends ResponeDefaultParams {
    data: {
        data: Product[];
    } & ResponePagesParams;
}