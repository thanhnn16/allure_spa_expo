import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/axiosInstance';

interface SendMessageParams {
  chat_id: string;
  message: string;
}

export const sendMessageThunk = createAsyncThunk(
  'chat/sendMessage',
  async (params: SendMessageParams, { rejectWithValue }: any) => {
    try {
      console.log('Sending message with params:', params);
      const response = await AxiosInstance().post('/messages', params);
      console.log('Send message response:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('Send message error:', {
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