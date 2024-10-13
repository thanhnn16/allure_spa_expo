import { createAsyncThunk } from "@reduxjs/toolkit";
import { TreatmentsResponeParams } from "@/types/treatment.type";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";

export const getTreatmentsThunk: any = createAsyncThunk(
    'treatment',
    async (_, { rejectWithValue }) => {
        try {
            const res: TreatmentsResponeParams = await AxiosInstance().get('treatments');
            // const res: TreatmentsResponeParams = await fetch('http://192.168.1.63:8000/api/treatments')
            console.log('Get treatment')
            if (res.status_code === 200 && res.data) {
                return res.data;
            }
            return rejectWithValue(res.message || 'Get treatments failed');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred during get treatments');
        }
    }
)