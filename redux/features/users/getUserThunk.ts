import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";
// Thunk để lấy thông tin người dùng
export const getUserThunk = createAsyncThunk(
  "user/getUser",
  async (_: any, { rejectWithValue }: any) => {
    try {
      const res: any = await AxiosInstance().get<User>("user/info");

      console.log('Get user info:', res.data);
      if (res.data.success) {
        return res.data.data;
      }

      console.log('Get user info failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Get user info failed');
    } catch (error: any) {
      console.error('Get user info error:', error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Get user info failed");
    }
  });
