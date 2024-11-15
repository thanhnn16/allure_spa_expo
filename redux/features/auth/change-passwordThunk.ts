import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { AuthResponse, AuthErrorCode } from "@/types/auth.type";

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (data: { oldPassword: string, newPassword: string }, { rejectWithValue }: { rejectWithValue: (value: any) => void }) => {
    try {
      const res: any = await AxiosInstance().put<AuthResponse>("auth/change-password", data);

      if (res.data.success) {
        return res.data.data;
      }

      console.log('Change password failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Change password failed');
    } catch (error: any) {
      console.error('Change password error:', error);
      return rejectWithValue(error.response?.data?.message || "Change password failed");
    }
  }
);
