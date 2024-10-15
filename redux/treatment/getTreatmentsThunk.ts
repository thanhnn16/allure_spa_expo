import { createAsyncThunk } from "@reduxjs/toolkit";
import { TreatmentsResponeParams } from "@/types/treatment.type";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";

export const getTreatmentsThunk: any = createAsyncThunk(
    'treatment',
    async (page, { rejectWithValue }) => {
        try {
            console.log(`Full request url ${AxiosInstance().defaults.baseURL}treatments`);
            const res: TreatmentsResponeParams = await AxiosInstance().get(`treatments?page=${page}`);

            if (res.status_code === 200 && res.data) {
                return res.data;
            }
            return rejectWithValue(res.message || 'Get treatments failed');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred during get treatments');
        }
    }
)