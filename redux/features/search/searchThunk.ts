import AxiosInstance from '@/utils/services/helper/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const searchItems = createAsyncThunk(
    'search/searchItems',
    async ({ query, type = 'all', limit = 10 }: { query: string; type?: string; limit?: number }) => {
        try {
            const response = await AxiosInstance().get(`/search`, {
                params: { query, type, limit }
            });
            return response.data.data;
        } catch (error) {
            throw error;
        }
    }
);
