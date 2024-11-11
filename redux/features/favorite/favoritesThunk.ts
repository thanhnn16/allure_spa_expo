import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFavoritesThunk = createAsyncThunk('favorite/fetchFavorites', async (_, { rejectWithValue }) => {
    try {
        const response = await AxiosInstance().get('/favorites');
        return response.data.data;
    } catch (error: any) {
        console.error('Unexpected error:', error.response.data);
        return rejectWithValue(error.response.data);
    }
});

export const toggleFavoriteThunk = createAsyncThunk(
    'favorite/toggleFavorite',
    async ({ type, itemId }: { type: 'product' | 'service'; itemId: number }, { rejectWithValue }) => {
        try {
            console.log('type', type);
            console.log('itemId', itemId);
            const response = await AxiosInstance().post('/favorites/toggle', {
                type,
                item_id: itemId,
            });
            console.log('response', response.data.data);
            if (response.status === 200) {
                return response.data.data.status;
            }
        } catch (error: any) {
            console.error('Unexpected error:', error.data.data);
            return rejectWithValue(error.response.data.message);
        }
    }
);
