import { createAsyncThunk } from "@reduxjs/toolkit";
import { ServiceDetailResponeParams } from "@/types/service.type";
import AxiosInstance from "@/utils/services/helper/axiosInstance";

export const getServiceDetailThunk = createAsyncThunk(
    'service/getServiceDetail',
    async ({ id, userId }: { id: string | number, userId?: string }, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().get(`services/${id}`, {
                params: { user_id: userId }
            });
            const res: ServiceDetailResponeParams = response.data;
            
            if (res.status_code === 200 && res.data) {
                return res.data;
            }
            return rejectWithValue(res.message || 'Không thể lấy thông tin dịch vụ');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Đã xảy ra lỗi khi lấy thông tin dịch vụ');
        }
    }
); 