import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";
// Thunk để lấy thông tin người dùng
export const getUserThunk = createAsyncThunk(
  "user/getUser",
  async (_: any, { rejectWithValue }: any) => {
    try {
      const res: any = await AxiosInstance().get<User>("user/info");

      if (res.data.success) {
        return res.data.data.data;
      }

      console.log('Get all user failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Get all products failed');
    } catch (error: any) {
      console.error('Get all user error:', error);
      return rejectWithValue(error.response?.data?.message || "Get all user failed");
    }
  });

