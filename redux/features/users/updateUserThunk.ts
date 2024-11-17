import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";
export const updateUserThunk = createAsyncThunk(
  "user/updateUser",
  async (data: any, { rejectWithValue }: any) => {
    try {
      const res: any = await AxiosInstance().put<User>(`user/profile`, data);
      if (res.data.success) {
        return res.data.data;
      }
      return rejectWithValue(res.data.message || 'Update user failed');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Update user failed");
    }
  });
