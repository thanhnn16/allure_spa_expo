import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from "@/utils/services/helper/axiosInstance";

export const fetchBanners = createAsyncThunk(
    'banners/fetchBanners',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance().get('/banners');
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue('Failed to fetch banners');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch banners');
        }
    }
);
