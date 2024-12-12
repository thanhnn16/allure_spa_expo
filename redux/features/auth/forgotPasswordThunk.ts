import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { handleAuthError } from "@/utils/services/helper/errorHandler";

interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: any;
}

type RejectValue = (value: any) => any;

export const forgotPasswordThunk = createAsyncThunk(
  "auth/forgotPassword",
  async (email: string, { rejectWithValue }: { rejectWithValue: RejectValue }) => {
    try {
      console.log('=== FORGOT PASSWORD REQUEST ===');
      console.log('Email:', email);
      console.log('===============================');

      const response = await AxiosInstance().post<ForgotPasswordResponse>(
        "auth/forgot-password",
        { 
          email: email.trim().toLowerCase(),
          lang: "vi"
        },
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('=== FORGOT PASSWORD RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('===============================');

      if (response.data.success) {
        return response.data;
      }

      return rejectWithValue(handleAuthError(response.data));
    } catch (error: any) {
      console.log('=== FORGOT PASSWORD ERROR ===');
      console.log('Error:', error);
      console.log('Response:', error.response?.data);
      console.log('============================');

      return rejectWithValue(handleAuthError(error));
    }
  }
);

// Reset mật khẩu với token từ email
export const resetPasswordThunk = createAsyncThunk(
  "auth/resetPassword",
  async (data: { token: string; password: string; password_confirmation: string }, 
    { rejectWithValue }: { rejectWithValue: RejectValue }) => {
    try {
      const response = await AxiosInstance().post("auth/reset-password", {
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation
      });

      if (response.data.success) {
        return response.data;
      }

      return rejectWithValue(response.data.message);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
    }
  }
); 