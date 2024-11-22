import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { OrderResponse } from "@/types/order.type";

interface OrderRequest {
  status: string;
  page?: number;
  per_page?: number;
}

export const getAllOrderThunk = createAsyncThunk(
  "orders/getAllOrders",
  async (params: OrderRequest, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.per_page) queryParams.append('per_page', params.per_page.toString());

      const url = `/orders/my-orders?${queryParams.toString()}`;
      const res = await AxiosInstance().get<OrderResponse>(url);

      if (res.data.success) {
        return res.data.data;
      }

      return rejectWithValue(res.data.message || 'Get orders failed');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Get orders failed");
    }
  }
);