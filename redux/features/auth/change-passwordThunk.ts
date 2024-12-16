import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthResponse } from "@/types/auth.type";

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (
    data: { current_password: string; new_password: string; new_password_confirmation: string },
    { rejectWithValue }: { rejectWithValue: (value: any) => void }
  ) => {
    try {
      const res: any = await AxiosInstance().post<AuthResponse>("auth/change-password", data);

      if (res.data.success) {
        return res.data.data;
      }

      return rejectWithValue(res.data.message || "Change password failed");
    } catch (error: any) {
      console.error("Change password error:", error.response?.data?.message);
      return rejectWithValue(error.response?.data?.message || "Change password failed");
    }
  }
);
