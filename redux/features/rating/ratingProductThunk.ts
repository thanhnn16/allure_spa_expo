import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { RatingResponseParams } from "@/types/rating.type";

interface RatingRequest {
  id: string;
}

export const getRatingProductThunk = createAsyncThunk(
  'products/getRating',
  async (body: RatingRequest, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const res = await AxiosInstance().get<RatingResponseParams>(`products/${body.id}/approved-ratings`);

      if (res.data.success) {
        return res.data;
      }

      console.log('Get rating failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Get rating failed');
    } catch (error: any) {
      console.error('Get rating error:', error);
      return rejectWithValue(error.response?.data?.message || "Get rating failed");
    }
  }
);