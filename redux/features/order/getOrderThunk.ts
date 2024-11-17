import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { OrderResponse } from "@/types/order.type";

interface OrderRequest {
    order: number;
}

export const getOrderThunk = createAsyncThunk(
    'orders/getOrderProducts',
    async (body: OrderRequest, { rejectWithValue }: any) => {
        try {
            const res = await AxiosInstance().get<OrderResponse>(`/orders/${body.order}`);
            if (res.data.success) {
                return res.data.data;
            }

            console.log('Get order failed:', res.data.message);
            return rejectWithValue(res.data.message || 'Get order failed');
        } catch (error: any) {
            console.error('Get order error:', error);
            return rejectWithValue(error.response?.data?.message || "Get order failed");
        }
    }
);