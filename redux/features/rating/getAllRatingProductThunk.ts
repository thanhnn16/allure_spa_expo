import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { RatingsListResponseParams } from "@/types/rating.type";

export const getAllRatingProductThunk = createAsyncThunk(
  'products/getAllRating',
  async (params: { id: string }, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const res = await AxiosInstance().get<RatingsListResponseParams>(`products/${params.id}/ratings`);

      if (res.data.data) {
        return res.data.data.data;
      }
      return [];
    } catch (error: any) {
      console.error("Get ratings error:", error.response?.data?.message);
      return rejectWithValue(
        error.response?.data?.message || "Get ratings failed"
      );
    }
  }
);
