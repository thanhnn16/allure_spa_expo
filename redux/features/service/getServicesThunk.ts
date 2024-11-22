import { createAsyncThunk } from "@reduxjs/toolkit";
import { ServicesResponeParams } from "@/types/service.type";
import AxiosInstance from "@/utils/services/helper/axiosInstance";

export const getServicesThunk = createAsyncThunk(
    'service/getServices',
    async ({ page, limit = 10 }: { page: number; limit?: number }, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().get(`services?page=${page}&limit=${limit}`);
            const res: ServicesResponeParams = response.data;
            if (res.status_code === 200 && res.data) {
                return {
                    data: res.data,
                    page,
                    hasMore: res.data.data.length === limit
                };
            }
            return rejectWithValue(res.message || 'Get services failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'An error occurred during get services');
        }
    }
);
