import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";

interface ForgotPasswordResponse {
    success: boolean;
    message: string;
    data: any;
}

interface ForgotPasswordRequest {
    email: string;
    lang: string;
}


export const forgotPasswordThunk = createAsyncThunk(
    "auth/forgotPassword",
    async (data: ForgotPasswordRequest, { rejectWithValue }: { rejectWithValue: any }) => {
        try {
            const response = await AxiosInstance().post<ForgotPasswordResponse>(
                "/auth/forgot-password",
                data
            );

            if (response.data.success) {
                return response.data;
            }

            return rejectWithValue(response.data.message);
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Có lỗi xảy ra");
        }
    }
); 