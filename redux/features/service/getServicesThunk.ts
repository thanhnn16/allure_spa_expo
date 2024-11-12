import { createAsyncThunk } from "@reduxjs/toolkit";
import { ServicesResponeParams } from "@/types/service.type";
import AxiosInstance from "@/utils/services/helper/axiosInstance";

export const getServicesThunk: any = createAsyncThunk(
    'service',
    async (page: number, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().get(`services?page=${page}`);
            const res: ServicesResponeParams = response.data;
            if (res.status_code === 200 && res.data) {
                console.log('Get services success:', res.data);
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
