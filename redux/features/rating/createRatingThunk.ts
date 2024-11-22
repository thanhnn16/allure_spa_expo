import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { RatingResponseParams } from "@/types/rating.type";

export const createRatingProductThunk = createAsyncThunk(
    'rating/createRating',
    async (formData: FormData, { rejectWithValue }: { rejectWithValue: any }) => {
        try {
            console.log("Sending FormData:", Array.from((formData as any)._parts));

            const res = await AxiosInstance('multipart/form-data')
                .post<RatingResponseParams>('ratings/from-order', formData, {
                    headers: {
                        'Accept': 'application/json',
                    },
                    transformRequest: [(data) => data],
                    timeout: 30000,
                });

            if (res.data.success) {
                return res.data.data;
            }

            return rejectWithValue(res.data.message || 'Create rating failed');
        } catch (error: any) {
            console.error('Create rating error:', error.response?.data?.message);
            return rejectWithValue(
                error.response?.data?.message ||
                error.message ||
                "Create rating failed"
            );
        }
    }
);