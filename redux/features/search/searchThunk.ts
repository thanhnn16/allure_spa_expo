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

export const searchMoreItems = createAsyncThunk(
    'search/searchMoreItems',
    async ({ query, type, sort_by, limit = 10, min_price, max_price }: 
        { 
            query: string; 
            type?: string; 
            limit?: number; 
            sort_by?: string; 
            min_price?: number; 
            max_price?: number 
        }
    ) => {
        try {
            const response = await AxiosInstance().get(`/search`, {
                params: { query, type, sort_by, limit, min_price, max_price }
            });
            return response.data.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
);
