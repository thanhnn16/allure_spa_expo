import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Orders, OrderState } from '@/types/order.type';
import { getOrderThunk } from './getOrderThunk';

const initialState: OrderState = {
    orders: [],
    isLoading: false,
    error: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {},
    extraReducers: (builder: any) => {
        builder
            .addCase(getOrderThunk.pending, (state: any) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrderThunk.fulfilled, (state: any, action: PayloadAction<Orders[]>) => {
                state.orders = action.payload;
                state.isLoading = false;
            })
            .addCase(getOrderThunk.rejected, (state: any, action: PayloadAction<string>) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export default orderSlice.reducer;
