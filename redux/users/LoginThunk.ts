import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { UserLoginResponseParams } from "@/app/authen/models/Models";

interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export const loginThunk = createAsyncThunk<UserLoginResponseParams, LoginRequest>(
  'user/login',
  async (body: LoginRequest, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance().post<UserLoginResponseParams>('auth/login', body);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Login failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred during login');
    }
  }
);
