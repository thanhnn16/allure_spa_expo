import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { OrderByIdResponse } from "@/types/order.type";

interface OrderByIdRequest {
    id: string | number;
}

export const getOrderByIdThunk = createAsyncThunk(
    "orders/getOrderById",
    async ({ id }: OrderByIdRequest, { rejectWithValue }: any) => {
        try {
            const res = await AxiosInstance().get<OrderByIdResponse>(`/orders/${id}`);
            if (res.data.success) {
                return res.data.data;
            }
            return rejectWithValue(res.data.message || 'Get order detail failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Get order detail failed");
        }
    }
); 