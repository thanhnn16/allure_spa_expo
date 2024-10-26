import { createAsyncThunk } from "@reduxjs/toolkit";
import { ServicesResponeParams } from "@/types/service.type";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";

export const getServicesThunk: any = createAsyncThunk(
    'service',
    async (page, { rejectWithValue }) => {
        try {
            console.log(`Đang gọi API: ${AxiosInstance().defaults.baseURL}services?page=${page}`);
            const response = await AxiosInstance().get(`services?page=${page}`);
            const res: ServicesResponeParams = response.data;

            console.log('Dữ liệu nhận được từ API:', JSON.stringify(res, null, 2));

            if (res.status_code === 200 && res.data) {
                console.log('Dữ liệu services:', JSON.stringify(res.data, null, 2));
                return res.data;
            }
            console.log('Lỗi: Get services failed. Message:', res.message);
            return rejectWithValue(res.message || 'Get services failed');
        } catch (error: any) {
            console.error('Lỗi khi gọi API:', error);
            return rejectWithValue(error.message || 'An error occurred during get services');
        }
    }
)
