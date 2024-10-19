import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { UserRegisterResponseParams } from "@/app/authen/models/Models";

interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export const registerThunk = createAsyncThunk<UserRegisterResponseParams, RegisterRequest>(
  'user/register',
  async (body: RegisterRequest, { rejectWithValue }) => {
    try {
      const res = await AxiosInstance().post<UserRegisterResponseParams>('auth/register', body);
      if (res.data.success) {
        return res.data;
      }
      return rejectWithValue(res.data.message || 'Registration failed');
    } catch (error: any) {
      return rejectWithValue(error.message || 'An error occurred during registration');
    }
  }
);
