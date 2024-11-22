import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { RatingsListResponseParams } from "@/types/rating.type";

export const getAllRatingProductThunk = createAsyncThunk(
  'ratings/getAll',
  async (params: { id: string, type: 'product' | 'service' }, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const endpoint = `${params.type}s/${params.id}/ratings`;
      const res = await AxiosInstance().get<RatingsListResponseParams>(endpoint);

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
