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
      console.log('Login request body:', body); // Log the request body

      const res = await AxiosInstance().post<UserLoginResponseParams>('auth/login', {
        phone_number: body.phoneNumber,
        password: body.password
      });
      console.log('Login response:', res); // Log the response

      if (res.data.success) {
        console.log('Login successful:', res.data); // Log success
        return res.data;
      }

      console.log('Login failed:', res.data.message); // Log failure message
      return rejectWithValue(res.data.message || 'Login failed');
    } catch (error: any) {
      console.error('Login error:', error); // Log error
      return rejectWithValue(error.data.message || 'An error occurred during login');
    }
  }
);