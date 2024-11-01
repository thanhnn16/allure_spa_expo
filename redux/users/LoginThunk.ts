import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/app/helper/AxiosInstance";
import { LoginRequest, LoginResponse } from "@/app/authen/models/Models";

export const loginThunk = createAsyncThunk<LoginResponse, LoginRequest>(
    'user/login',
    async (body: LoginRequest, { rejectWithValue }) => {
        try {
            const res: LoginResponse = await AxiosInstance().post('auth/login', body);
            if (res.status_code === 200 && res.data) {
                return res;
            }
            return rejectWithValue(res.message || 'Login failed');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred during login');
        }
    }
)