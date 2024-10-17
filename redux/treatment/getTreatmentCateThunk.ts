import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { TreatmentCategoriesResponeParams } from '@/types/treatment.type'

export const getTreatmentCateThunk: any = createAsyncThunk(
    'treatment/getCategories',
    async (_, { rejectWithValue }) => {
        try {
            const res: TreatmentCategoriesResponeParams = await AxiosInstance().get('treatment-categories');
            if (res.status_code === 200 && res.data) {
                return res.data;
            }
            return rejectWithValue(res.message || 'Get categories failed');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred during get categories');
        }
    }
)