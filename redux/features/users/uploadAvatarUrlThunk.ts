import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";

export const uploadAvatarUrlThunk = createAsyncThunk(
  "user/uploadAvatar",
  async (formData: FormData, { rejectWithValue }: any) => {
    try {
      const res: any = await AxiosInstance().post<User>("user/avatar", formData, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        transformRequest: (data) => {
          return data;
        },
      });

      if (res.data.success) {
        return res.data.data;
      }

      return rejectWithValue(res.data.message || 'Upload avatar failed');
    } catch (error: any) {
      console.error('Upload avatar error:', error);
      return rejectWithValue(error.response?.data?.message || "Upload avatar failed");
    }
  }
);
