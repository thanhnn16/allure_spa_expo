import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";

export const getUserThunk = createAsyncThunk(
  "user/getUser",
  async (_: any, { rejectWithValue }: any) => {
    try {
      const res: any = await AxiosInstance().get<User>("user/info");

      if (res.data.success) {
        return res.data.data;
      }

      return rejectWithValue(res.data.message || 'Get user info failed');
    } catch (error: any) {
      console.error('Get user info error:', error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Get user info failed");
    }
  });
