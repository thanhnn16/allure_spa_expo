import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchFavoritesThunkByType = createAsyncThunk('favorite/fetchFavoritesByType', async ({ type }: { type: 'product' | 'service' }, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
        const response = await AxiosInstance().get(`/favorites/${type}`);
        console.log('response', response.data.data);
        return response.data.data;
    } catch (error: any) {
        console.error('Unexpected error:', error.response.data);
        return rejectWithValue(error.response.data);
    }
});

export const toggleFavoriteThunk = createAsyncThunk(
    "favorite/toggleFavorite",
    async (
        { type, itemId }: { type: "product" | "service"; itemId: number },
        { rejectWithValue }: { rejectWithValue: any }
    ) => {
        try {
            const response = await AxiosInstance().post("/favorites/toggle", {
                type,
                item_id: itemId,
            });
            return response.data.data;
        } catch (error: any) {
            console.error('Unexpected error:', error.data.data);
            return rejectWithValue(error.response.data.message);
        }
    }
);
