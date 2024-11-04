import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/AxiosInstance';

interface SendMessageParams {
  chat_id: string;
  message: string;
}

export const sendMessageThunk = createAsyncThunk(
  'chat/sendMessage',
  async (params: SendMessageParams, { rejectWithValue }) => {
    try {
      const response = await AxiosInstance().post('/messages', params);
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
); 