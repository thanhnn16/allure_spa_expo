import { OrderResponse } from "@/types/order.type";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { createAsyncThunk } from "@reduxjs/toolkit";

interface OrderByIdRequest {
    id: string | number;
}

export const changeOrderStatusByIdThunk = createAsyncThunk(
    "orders/changeOrderStatusById",
    async ({ id }: OrderByIdRequest, { rejectWithValue }: any) => {
        try {
            const res = await AxiosInstance().put<OrderResponse>(`/orders/${id}`, {
                "status": "cancelled",
                "note": "User cancel order"
            });
            if (res.data.success) {
                return res.data.data;
            }
            return rejectWithValue(res.data.message || 'Get order detail failed');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || "Get order detail failed");
        }
    }
); 