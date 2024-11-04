import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/AxiosInstance';

export const fetchChatsThunk = createAsyncThunk(
    'chat/fetchChats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance().get('/chats');
            return response.data.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);
