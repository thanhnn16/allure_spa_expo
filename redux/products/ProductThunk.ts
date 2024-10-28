import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { ProductResponseParams } from "@/types/product.type";

interface ProductRequest{
    id: string;
}

export const ProductThunk = createAsyncThunk(
  'products/getProduct',
  async (body: ProductRequest, { rejectWithValue }) => {
    try {
      console.log('Get product request body:', body);

      const res = await AxiosInstance().get<ProductResponseParams>(`products/${body.id}`);
      console.log('Get product response:', res);

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