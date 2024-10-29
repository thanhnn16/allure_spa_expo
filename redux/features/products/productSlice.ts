import { createSlice, PayloadAction, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { Product } from "@/types/product.type";
import { getProductThunk } from "./productThunk";
import { getAllProductsThunk } from "./getAllProductsThunk";

interface ProductState {
  product: Product | null;
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  product: null,
  products: [],
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
      })
      .addCase(getAllProductsThunk.pending, (state: ProductState) => {
        state.isLoading = true;
      })
      .addCase(getAllProductsThunk.fulfilled, (state: ProductState, action: PayloadAction<Product[]>) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getAllProductsThunk.rejected, (state: ProductState, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;