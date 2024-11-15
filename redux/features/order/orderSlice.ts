import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Orders } from '@/types/order.type';
import { getAllOrderThunk } from './getAllOrderThunk';
import { getOrderThunk } from './getOrderThunk';
import { getOrderByIdThunk } from './getOrderByIdThunk';

interface OrderState {
    orders: Orders[] | Orders;
    isLoading: boolean;
    isLoadingMore: boolean;
    error: null | string;
    totalAmount: number;
    fromCart: boolean;
    pagination: {
        currentPage: number;
        lastPage: number;
        total: number;
        perPage: number;
    };
    selectedOrder: Orders | null;
}

const initialState: OrderState = {
    orders: [],
    isLoading: false,
    isLoadingMore: false,
    error: null,
    totalAmount: 0,
    fromCart: false,
    pagination: {
        currentPage: 1,
        lastPage: 1,
        total: 0,
        perPage: 10
    },
    selectedOrder: null
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrder: (state: OrderState) => {
            state.orders = [];
        },
        resetOrders: (state: OrderState) => {
            state.orders = [];
            state.pagination = {
                currentPage: 1,
                lastPage: 1,
                total: 0,
                perPage: 10
            };
        },
        setOrderProducts: (state: OrderState, action: any) => {
            state.orders = action.payload.products;
            state.totalAmount = action.payload.totalAmount;
            state.fromCart = action.payload.fromCart;
        },
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(getAllOrderThunk.pending, (state: OrderState, action: any) => {
                const isLoadMore = action.meta.arg?.page > 1;
                if (isLoadMore) {
                    state.isLoadingMore = true;
                } else {
                    state.isLoading = true;
                }
                state.error = null;
            })
            .addCase(getAllOrderThunk.fulfilled, (state: OrderState, action: any) => {
                const isLoadMore = action.meta.arg?.page > 1;
                if (isLoadMore) {
                    state.orders = Array.isArray(state.orders) && Array.isArray(action.payload.data) ?
                        [...state.orders, ...action.payload.data] :
                        action.payload.data;
                    state.isLoadingMore = false;
                } else {
                    state.orders = action.payload.data;
                    state.isLoading = false;
                }

                state.pagination = {
                    currentPage: action.payload.current_page,
                    lastPage: action.payload.last_page,
                    total: action.payload.total,
                    perPage: action.payload.per_page
                };
            })
            .addCase(getAllOrderThunk.rejected, (state: OrderState, action: any) => {
                const isLoadMore = action.meta.arg?.page > 1;
                if (isLoadMore) {
                    state.isLoadingMore = false;
                } else {
                    state.isLoading = false;
                }
                state.error = action.payload;
            })
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
            })
            .addCase(getOrderByIdThunk.pending, (state: OrderState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrderByIdThunk.fulfilled, (state: OrderState, action: any) => {
                state.selectedOrder = action.payload;
                state.isLoading = false;
            })
            .addCase(getOrderByIdThunk.rejected, (state: OrderState, action: any) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrder, resetOrders, setOrderProducts } = orderSlice.actions;
export default orderSlice.reducer;
