import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { User } from "@/types/user.type";
// Thunk để lấy thông tin người dùng
export const updateAvatarUrlThunk = createAsyncThunk(
  "user/updateAvatar",
  async (_: any, { rejectWithValue }: any) => {
    try {
      const res: any = await AxiosInstance().get<User>("user/avatar");

      if (res.data.success) {
        return res.data.data.data;
    }

      console.log('Update avatar failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Get all products failed');
    } catch (error: any) {
      console.error('Update avatar error:', error);
      return rejectWithValue(error.response?.data?.message || "Update avatar failed");
    }
  });

  