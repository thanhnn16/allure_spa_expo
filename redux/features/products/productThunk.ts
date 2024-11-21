import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { ProductResponseParams } from "@/types/product.type";

export const getProductThunk = createAsyncThunk(
  'products/getProduct',
  async (params: any, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const res = await AxiosInstance().get<ProductResponseParams>(`products/${params.product_id}?user_id=${params.user_id}`);

      if (res.data.success) {
        return res.data.data;
      }

      console.log('Get product failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Get product failed');
    } catch (error: any) {
      console.error('Get product error:', error);
      return rejectWithValue(error.response?.data?.message || "Get product failed");
    }
  }
);
