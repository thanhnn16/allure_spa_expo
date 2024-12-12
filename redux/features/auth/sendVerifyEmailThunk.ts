import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { handleAuthError } from "@/utils/services/helper/errorHandler";

interface SendVerifyEmailResponse {
  success: boolean;
  message: string;
  data: any;
}

type RejectValue = (value: any) => any;

export const sendVerifyEmailThunk = createAsyncThunk(
  "auth/sendVerifyEmail",
  async (email: string, { rejectWithValue }: { rejectWithValue: RejectValue }) => {
    try {
      const response = await AxiosInstance().post<SendVerifyEmailResponse>(
        "email/verify/send",
        { 
          email,
          lang: "vi"
        }
      );

      console.log('=== SEND VERIFY EMAIL RESPONSE ===');
      console.log(JSON.stringify(response.data, null, 2));
      console.log('===================================');

      if (response.data.success) {
        return response.data;
      }

      return rejectWithValue(handleAuthError(response.data));
    } catch (error: any) {
      console.log('=== SEND VERIFY EMAIL ERROR ===');
      console.log('Error:', error);
      console.log('Response:', error.response?.data);
      console.log('==============================');

      return rejectWithValue(handleAuthError(error));
    }
  }
); 