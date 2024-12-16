import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { ProductsListResponseParams } from "@/types/product.type";

export const getAllProductsThunk = createAsyncThunk(
    'products/getAllProducts',
    async (_: any, { rejectWithValue }: any) => {
        try {
            const res = await AxiosInstance().get<ProductsListResponseParams>('/products');

            if (res.data.success) {
                return res.data.data;
            }

            console.log('Get all products failed:', res.data.message);
            return rejectWithValue(res.data.message || 'Get all products failed');
        } catch (error: any) {
            console.error('Get all products error:', error);
            return rejectWithValue(error.response?.data?.message || "Get all products failed");
        }
    }
); 