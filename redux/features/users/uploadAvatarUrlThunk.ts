import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";

export const uploadAvatarUrlThunk = createAsyncThunk(
  "user/avatar",
  async (formData: FormData, { rejectWithValue }: any) => {
    
    try {
      const res: any = await AxiosInstance().post<User>("user/avatar", formData, 
       {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (res.data.success) {
        return res.data.data;
      }

      console.log('Upload avatar failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Get all products failed');
    } catch (error: any) {
      console.error('Upload avatar error:', error.response?.data?.message);
      console.error('Request: ', error.response?.config);
      return rejectWithValue(error.response?.data?.message || "Upload avatar failed");
    }
  });
