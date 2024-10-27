import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { UserRegisterResponseParams } from "@/types/Models";

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
      console.log('Register request body:', body); // Log the request body

      const res = await AxiosInstance().post<UserRegisterResponseParams>('auth/register', {
        full_name: body.fullName,
        phone_number: body.phoneNumber,
        password: body.password,
        password_confirmation: body.confirmPassword
      });
      console.log('Register response:', res.data); // Log the response

      if (res.data.success) {
        console.log('Registration successful:', res.data); // Log success
        return res.data;
      }

      console.log('Registration failed:', res.data.message); // Log failure message
      return rejectWithValue(res.data.message || 'Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error); // Log error
      return rejectWithValue(error.data.message || 'An error occurred during registration');
    }
  }
);