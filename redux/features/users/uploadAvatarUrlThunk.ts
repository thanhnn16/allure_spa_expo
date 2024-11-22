import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";

export const uploadAvatarUrlThunk = createAsyncThunk(
  "user/uploadAvatar",
  async (formData: FormData, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      console.log("Sending FormData:", Array.from((formData as any)._parts));

      const axiosInstance = AxiosInstance('multipart/form-data');

      const res = await axiosInstance.post("user/avatar", formData, {
        headers: {
          'Accept': 'application/json',
        },
        transformRequest: [(data) => data],
        timeout: 30000,
      });

      if (res.data.success) {
        return res.data.data;
      }

      return rejectWithValue(res.data.message || 'Upload avatar failed');
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
        error.message ||
        "Upload avatar failed"
      );
    }
  }
);
