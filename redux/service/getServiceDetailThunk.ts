import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { ServiceDetailResponeParams } from "@/types/service.type";

export const getServiceDetailThunk: any = createAsyncThunk(
    'service/getServiceDetail',
    async (id: number, { rejectWithValue }: any) => {
        try {
            const res: ServiceDetailResponeParams = await AxiosInstance().get(`services/${id}`);
            const data =res.data;
            
            if (data.status_code === 200 && data) {
                return res.data;
            }
            return rejectWithValue(res.message || 'Get service detail failed');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred during get service detail');
        }
    }
)