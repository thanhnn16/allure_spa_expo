import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { User } from "@/types/user.type";
// Thunk để lấy thông tin người dùng
  export const updateUserThunk = createAsyncThunk(
    "user/updateUser",
    async (data: any, { rejectWithValue }: any) => {
      try {
        const res: any = await AxiosInstance().put<User>(`user/${data.id}`, data);
  
        if (res.data.success) {
          return res.data.data.data;
      }
  
        console.log('Update user failed:', res.data.message);
        return rejectWithValue(res.data.message || 'Update products failed');
      } catch (error: any) {
        console.error('Update user error:', error);
        return rejectWithValue(error.response?.data?.message || "Update user failed");
      }
    });
