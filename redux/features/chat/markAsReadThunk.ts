import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/axiosInstance';

export const markAsReadThunk = createAsyncThunk(
  'chat/markAsRead',
  async (chatId: string, { rejectWithValue }: any) => {
    try {
      const response = await AxiosInstance().post(`/chats/${chatId}/mark-as-read`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
); 