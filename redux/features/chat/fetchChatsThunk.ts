import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/axiosInstance';

export const fetchChatsThunk = createAsyncThunk(
    'chat/fetchChats',
    async (_: any, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().get('/chats');
            return response.data.data;
        } catch (error: any) {
            console.error('Fetch chats error:', {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message
            });
            return rejectWithValue({
                status: error.response?.status,
                message: error.response?.data?.message || error.message,
                error: error.response?.data
            });
        }
    }
);
