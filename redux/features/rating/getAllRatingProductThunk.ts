import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { RatingsListResponseParams } from "@/types/rating.type";

interface RatingRequest {
  id: string;
}

export const getAllRatingProductThunk = createAsyncThunk(
  'products/getAllRating',
  async (body: RatingRequest, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const res = await AxiosInstance().get<RatingsListResponseParams>(`products/${body.id}/ratings`);

      if (res.data.data) {
        console.log('Get ratings success:', res.data.data);
        return res.data.data;
      }

      console.log('Get ratings failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Get rating failed');
    } catch (error: any) {
      console.error('Get ratings error:', error);
      return rejectWithValue(error.response?.data?.message || "Get ratings failed");
    }
  }
);
