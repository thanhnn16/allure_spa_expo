import { Timestamps, ResponePagesParams, ResponeDefaultParams } from "./commons.type";
import { Media } from "./media.type";
import { User } from "./user.type";

export interface Rating extends Timestamps {
    id: number;
    user_id: string;
    user?: User;
    order_item_id: number;
    rating_type: 'service' | 'product';
    item_id: number;
    stars: number;
    comment: string;
    status: 'pending' | 'approved';
    media_urls?: MediaUrl[];
    media?: Media[];
}
export interface MediaUrl {
    id: number;
    type: string;
    url: string;
    position: number;
}

export interface RatingResponseParams extends ResponeDefaultParams {
    data: Rating;
}

export interface RatingsListResponseParams extends ResponeDefaultParams {
    data: {
        data: Rating[];
        current_page: number;
        total: number;
        per_page: number;
    };
    meta: any;
}

export interface CreateRatingRequest {
    "rating_type": string,
    "item_id": number,
    "stars": number,
    "comment": string,
    "media_id": number
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