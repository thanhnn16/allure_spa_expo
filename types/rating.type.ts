import { Timestamps, ResponePagesParams, ResponeDefaultParams } from "./commons.type";

export interface Rating extends Timestamps {
    id: number;
    user_id: string;
    rating_type: string;
    item_id: number;
    stars: number;
    comment: string;
    image_id: number;
    video_id: number;
    status: string;
}

export interface RatingResponseParams extends ResponeDefaultParams {
    data: Rating;
}

export interface RatingsListResponseParams extends ResponeDefaultParams {
    data: Rating[];
    meta: any;
}

export interface CreateRatingRequest {
    "rating_type": string,
    "item_id": number,
    "stars": number,
    "comment": string,
    "media": number,
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