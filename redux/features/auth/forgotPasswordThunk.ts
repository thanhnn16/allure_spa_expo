import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: any;
}

interface ForgotPasswordRequest {
  email: string;
}

type RejectValue = (value: string) => any;

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }: { rejectWithValue: RejectValue }) => {
    try {
      const data: ForgotPasswordRequest = {
        email,
      };

      const response = await AxiosInstance().post<ForgotPasswordResponse>(
        "/api/auth/forgot-password", 
        data
      );

      if (response.data.success) {
        return response.data;
      }

      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
); 