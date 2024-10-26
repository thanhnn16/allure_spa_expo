import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { ServiceCategoriesResponeParams } from '@/types/service.type'

export const getServiceCateThunk: any = createAsyncThunk(
    'service/getCategories',
    async (_, { rejectWithValue }) => {
        try {
            const res: ServiceCategoriesResponeParams = await AxiosInstance().get('services/categories');
            if (res.status_code === 200 && res.data) {
                return res.data;
            }
            return rejectWithValue(res.message || 'Get categories failed');
        } catch (error: any) {
            return rejectWithValue(error.message || 'An error occurred during get categories');
        }
    }
)
