import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/app/helper/AxiosInstance";
import { RegisterRequest, RegisterResponse } from "@/app/authen/models/Models";

export const registerThunk = createAsyncThunk<RegisterResponse, RegisterRequest>(
    'user/register',
    async (body: RegisterRequest, { rejectWithValue }) => {
        try {
            const res: RegisterResponse = await AxiosInstance().post('auth/register', body);
            if (res.status_code === 200 && res.data) {
                return res;
            }
            return rejectWithValue(res.message || 'Registration failed');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred during registration');
        }
    }
)