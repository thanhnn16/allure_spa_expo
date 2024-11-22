import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { RatingsListResponseParams } from "@/types/rating.type";

export const getAllRatingThunk = createAsyncThunk(
  'ratings/getAll',
  async (params: { id: string, type: 'product' | 'service' }, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const endpoint = `${params.type}s/${params.id}/ratings`;

      const res = await AxiosInstance().get<RatingsListResponseParams>(endpoint);

      console.log('res', res.data.data);
      console.log('res media', res.data.data.data[0].media);
      console.log('res media url', res.data.data.data[0].media_urls);

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
