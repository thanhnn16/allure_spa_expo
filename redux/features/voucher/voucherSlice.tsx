import { createSlice } from "@reduxjs/toolkit";
import { toggleFavoriteThunk } from "@/redux/features/favorite/favoritesThunk";
import { Voucher } from "@/types/voucher.type";
import { getAllVouchersThunk } from "./getAllVoucherThunk";

interface VoucherState {
    voucher: Voucher | null;
    vouchers: Voucher[];
    isLoading: boolean;
    error: string | null;
    status: string | null;
}

const initialState: VoucherState = {
    voucher: null,
    vouchers: [],
    isLoading: false,
    error: null,
    status: null,
};

export const voucherSlice = createSlice({
    name: "voucher",
    initialState,
    reducers: {
        clearProduct(state: VoucherState) {
            state.voucher = null;
            state.isLoading = false;
            state.error = null;
        },
    },
    extraReducers: (builder: any) => {
        builder
            // .addCase(getProductThunk.pending, (state: ProductState) => {
            //     state.isLoading = true;
            // })
            // .addCase(getProductThunk.fulfilled, (state: ProductState, action: any) => {
            //     state.isLoading = false;
            //     state.product = action.payload;
            // })
            // .addCase(getProductThunk.rejected, (state: ProductState, action: any) => {
            //     state.isLoading = false;
            //     state.error = action.payload || "Failed to fetch product";
            // })
            .addCase(getAllVouchersThunk.pending, (state: VoucherState) => {
                state.isLoading = true;
            })
            .addCase(getAllVouchersThunk.fulfilled, (state: VoucherState, action: any) => {
                state.isLoading = false;
                state.vouchers = action.payload;
            })
            .addCase(getAllVouchersThunk.rejected, (state: VoucherState, action: any) => {
                state.isLoading = false;
                state.error = action.payload || "Failed to fetch products";
            })
    },
});

export const { clearVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;