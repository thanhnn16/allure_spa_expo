import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { CreateRatingRequest, RatingResponseParams } from "@/types/rating.type";

export const createRatingProductThunk = createAsyncThunk(
    'rating/createRating',
    async (body: CreateRatingRequest, { rejectWithValue }: { rejectWithValue: any }) => {
        try {
            console.log('post data: ', body);

            const res = await AxiosInstance().post<RatingResponseParams>(`ratings/from-order`,
                {
                    rating_type: body.rating_type,
                    item_id: body.item_id,
                    stars: body.stars,
                    comment: body.comment,
                    media: body.media,
                }
            );

            

            if (res.data.success) {
                return res.data;
            }

            console.log('post rating failed:', res.data.message);
            return rejectWithValue(res.data.message || 'Get rating failed');
        } catch (error: any) {
            console.error('Get rating error:', error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message || "Get rating failed");
        }
    }
);