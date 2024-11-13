import { createSlice, PayloadAction, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { Product } from "@/types/product.type";
import { getProductThunk } from "./productThunk";
import { getAllProductsThunk } from "./getAllProductsThunk";
import {toggleFavoriteThunk} from "@/redux/features/favorite/favoritesThunk";

interface ProductState {
  product: Product | null;
  products: Product[];
  isLoading: boolean;
  error: string | null;
  status: string | null;
}

const initialState: ProductState = {
  product: null,
  products: [],
  isLoading: false,
  error: null,
  status: null,
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
  extraReducers: (builder: any) => {
    builder
      .addCase(getProductThunk.pending, (state: ProductState) => {
        state.isLoading = true;
      })
      .addCase(getProductThunk.fulfilled, (state: ProductState, action: any) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductThunk.rejected, (state: ProductState, action: any) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch product";
      })
      .addCase(getAllProductsThunk.pending, (state: ProductState) => {
        state.isLoading = true;
      })
      .addCase(getAllProductsThunk.fulfilled, (state: ProductState, action: any) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getAllProductsThunk.rejected, (state: ProductState, action: any) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      })
        .addCase(toggleFavoriteThunk.pending, (state: ProductState) => {
            state.isLoading = true;
        })
        .addCase(toggleFavoriteThunk.fulfilled, (state: ProductState, action: any) => {
            state.isLoading = false;
            state.status = action.payload;
        })
        .addCase(toggleFavoriteThunk.rejected, (state: ProductState, action: any) => {
            state.isLoading = false;
            state.error = action.payload || "Failed to toggle favorite";
        });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
