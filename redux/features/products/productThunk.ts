import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { ProductResponseParams } from "@/types/product.type";

interface ProductRequest {
  id: string;
}

export const getProductThunk = createAsyncThunk(
  'products/getProduct',
  async (body: ProductRequest, { rejectWithValue }: { rejectWithValue: any }) => {
    try {
      const res = await AxiosInstance().get<ProductResponseParams>(`products/${body.id}`);

      if (res.data.success) {
        return res.data;
      }

      console.log('Get product failed:', res.data.message);
      return rejectWithValue(res.data.message || 'Get product failed');
    } catch (error: any) {
      console.error('Get product error:', error);
      return rejectWithValue(error.response?.data?.message || "Get product failed");
    }
  }
);