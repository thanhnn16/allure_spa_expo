import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { UserHistoryLogin } from "@/types/user.type";

export const getUserHistoryLogin = createAsyncThunk(
  "user/getUserHistoryLogin",
  async (_: any, { rejectWithValue }: any) => {
    try {
      const res: any = await AxiosInstance().get<UserHistoryLogin>("/auth/login-histories");

      if (res.data.success) {
        return res.data.data;
      }

      return rejectWithValue(res.data.message || 'Get user info failed');
    } catch (error: any) {
      console.error('Get user info error:', error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Get user info failed");
    }
  });
