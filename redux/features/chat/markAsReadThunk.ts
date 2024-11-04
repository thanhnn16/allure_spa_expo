import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/AxiosInstance';

export const markAsReadThunk = createAsyncThunk(
  'chat/markAsRead',
  async (chatId: string, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance().post(`/chats/${chatId}/mark-as-read`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
); 