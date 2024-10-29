import { createSlice, PayloadAction, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { Product } from "@/types/product.type";
import { getProductThunk } from "./productThunk";

interface ProductState {
  product: Product | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: null,
  isLoading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProduct(state: ProductState) {
      state.product = null;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<ProductState>) => {
    builder
      .addCase(getProductThunk.pending, (state: ProductState) => {
        state.isLoading = true;
      })
      .addCase(getProductThunk.fulfilled, (state: ProductState, action: PayloadAction<Product>) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductThunk.rejected, (state: ProductState, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch product";
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;