import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { OrderResponse } from "@/types/order.type";

export const getOrderThunk = createAsyncThunk(
  'orders/getOrderProducts',
  async ({status}: any, { rejectWithValue }: any) => {
    try {
      const res = await AxiosInstance().get<OrderResponse>('/orders/my-orders', {
        params: { status },
      });

      if (res.data.success) {
        console.log('Get all order success:', res.data.data);
        return res.data.data.data;
      }

      console.log('Get all products failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Get all products failed');
    } catch (error: any) {
      console.error('Get all products error:', error);
      return rejectWithValue(error.response?.data?.message || "Get all products failed");
    }
  }
);