import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { OrderResponse } from "@/types/order.type";

interface OrderByIdRequest {
    id: string | number;
}

export const getOrderByIdThunk = createAsyncThunk(
    "orders/getOrderById",
    async ({ id }: OrderByIdRequest, { rejectWithValue }: any) => {
        try {
            const res = await AxiosInstance().get<OrderResponse>(`/orders/${id}`);
            console.log("Get order detail res:", res.data);
            if (res.data.success) {
                return res.data.data;
            }

            console.log('Get order detail failed:', res.data.message);
            return rejectWithValue(res.data.message || 'Get order detail failed');
        } catch (error: any) {
            console.error('Get order detail error:', error.response?.data.message);
            return rejectWithValue(error.response?.data?.message || "Get order detail failed");
        }
    }
); 