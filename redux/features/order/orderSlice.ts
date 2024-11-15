import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Orders } from '@/types/order.type';
import { getOrderThunk } from './getOrderThunk';

interface OrderState {
    orders: Orders[] | [];
    isLoading: boolean;
    error: null | string;
    totalAmount: number;
    fromCart: boolean;
}

const initialState: OrderState = {
    orders: [],
    isLoading: false,
    error: null,
    totalAmount: 0,
    fromCart: false
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrder: (state: OrderState) => {
            state.orders = [];
        },
        setOrderProducts: (state: OrderState, action: any) => {
            state.orders = action.payload.products;
            state.totalAmount = action.payload.totalAmount;
            state.fromCart = action.payload.fromCart;
        },
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(getOrderThunk.pending, (state: any) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrderThunk.fulfilled, (state: any, action: any) => {
                state.orders = action.payload;
                state.isLoading = false;
            })
            .addCase(getOrderThunk.rejected, (state: any, action: any) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrder, setOrderProducts } = orderSlice.actions;
export default orderSlice.reducer;
