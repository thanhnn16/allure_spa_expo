import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { OrderResponse } from "@/types/order.type";

interface OrderRequest {
  status?: string;
  page?: number;
  per_page?: number;
}

export const getAllOrderThunk = createAsyncThunk(
  "orders/getAllOrders",
  async (params: OrderRequest, { rejectWithValue }: any) => {
    try {
      let url = "/orders/my-orders";
      const queryParams = [];

      if (params?.status) {
        queryParams.push(`status=${params.status}`);
      }
      if (params?.page) {
        queryParams.push(`page=${params.page}`);
      }
      if (params?.per_page) {
        queryParams.push(`per_page=${params.per_page}`);
      }

      if (queryParams.length > 0) {
        url += `?${queryParams.join('&')}`;
      }

      const res = await AxiosInstance().get<OrderResponse>(url);
      if (res.data.success) {
        return res.data.data;
      }

      console.log('Get orders failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Get orders failed');
    } catch (error: any) {
      console.error('Get orders error:', error);
      return rejectWithValue(error.response?.data?.message || "Get orders failed");
    }
  }
);