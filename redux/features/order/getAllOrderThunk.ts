import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { OrderResponse } from "@/types/order.type";

export const getAllOrderThunk = createAsyncThunk(
  'orders/getAllOrderProducts',
  async (_: any, { rejectWithValue }: any) => {
    try {
      const res = await AxiosInstance().get<OrderResponse>('/orders/my-orders');
      if (res.data.success) {
        return res.data.data.data;
      }
      
      return rejectWithValue(res.data.message || 'Get all products failed');
    } catch (error: any) {
      console.error('Get all products error:', error);
      return rejectWithValue(error.response?.data?.message || "Get all products failed");
    }
  }
);