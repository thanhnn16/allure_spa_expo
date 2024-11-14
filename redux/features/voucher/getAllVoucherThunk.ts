import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { VoucherResponseParams } from "@/types/voucher.type";

export const getAllVouchersThunk = createAsyncThunk(
    'voucher/getAllVouchers',
    async (_: any, { rejectWithValue }: any) => {
        try {
            const res = await AxiosInstance().get<VoucherResponseParams>('/vouchers/my-vouchers');

            if (res.data.success) {
                return res.data.data;
            }

            return rejectWithValue(res.data.message || 'Get all products failed');
        } catch (error: any) {
            console.error('Get all products error:', error);
            return rejectWithValue(error.response?.data?.message || "Get all products failed");
        }
    }
); 