import AxiosInstance from '@/utils/services/helper/axiosInstance';
import { createAsyncThunk } from '@reduxjs/toolkit';

export interface SearchParams {
    query: string;
    type?: 'all' | 'products' | 'services';
    limit?: number;
    sort_by?: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'rating';
    min_price?: number;
    max_price?: number;
    category_id?: number;
}

export const searchItems = createAsyncThunk(
    'search/searchItems',
    async (params: SearchParams) => {
        try {
            const response = await AxiosInstance().get(`/search`, {
                params: params
            });
            console.log('Raw API Response:', response.data);
            return response.data.data;
        } catch (error: any) {
            console.error('Search Error:', error.response?.data);
            throw error;
        }
    }
);
