import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/AxiosInstance';

interface FetchMessagesParams {
  chatId: string;
  page: number;
  perPage?: number;
}

export const fetchMessagesThunk = createAsyncThunk(
  'chat/fetchMessages',
  async (params: FetchMessagesParams, { rejectWithValue }) => {
    try {
      const { chatId, page, perPage = 20 } = params;
      const response = await AxiosInstance().get(`/chats/${chatId}/messages`, {
        params: { page, per_page: perPage }
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
); 