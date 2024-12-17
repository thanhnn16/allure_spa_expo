import { createSlice, PayloadAction, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { Product } from "@/types/product.type";
import { getProductThunk } from "./productThunk";
import { getAllProductsThunk } from "./getAllProductsThunk";
import { toggleFavoriteThunk } from "@/redux/features/favorite/favoritesThunk";
import { Media } from "@/types/media.type";

interface ProductState {
  product: Product | null;
  media: Media[];
  products: Product[];
  pagination: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
  isLoading: boolean;
  toggleFavoriteLoading: boolean;
  error: string | null;
  status: string | null;
}

const initialState: ProductState = {
  product: null,
  products: [],
  media: [],
  pagination: {
    current_page: 1,
    per_page: 10,
    total: 0,
    last_page: 1
  },
  isLoading: true,
  toggleFavoriteLoading: false,
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
        state.media = action.payload.media;
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
        state.products = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
          last_page: action.payload.last_page
        };
      })
      .addCase(getAllProductsThunk.rejected, (state: ProductState, action: any) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch products";
      })
      .addCase(toggleFavoriteThunk.pending, (state: ProductState) => {
        state.toggleFavoriteLoading = true;
      })
      .addCase(toggleFavoriteThunk.fulfilled, (state: ProductState, action: any) => {
        state.toggleFavoriteLoading = false;
        state.status = action.payload;
      })
      .addCase(toggleFavoriteThunk.rejected, (state: ProductState, action: any) => {
        state.toggleFavoriteLoading = false;
        state.error = action.payload || "Failed to toggle favorite";
      });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
