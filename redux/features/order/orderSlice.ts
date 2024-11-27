import { createSlice } from '@reduxjs/toolkit';
import { CheckoutOrderItem, Orders } from '@/types/order.type';
import { getAllOrderThunk } from './getAllOrderThunk';
import { getOrderThunk } from './getOrderThunk';
import { getOrderByIdThunk } from './getOrderByIdThunk';
import { changeOrderStatusByIdThunk } from './changeOrderStatusThunk';
import { createOrder } from './createOrderThunk';

interface OrderState {
    ordersByStatus: {
        [key: string]: {
            data: Orders[],
            pagination: {
                currentPage: number;
                lastPage: number;
                total: number;
                perPage: number;
            }
        }
    };
    isLoading: boolean;
    isLoadingMore: boolean;
    error: null | string;
    totalAmount: number;
    fromCart: boolean;
    selectedOrder: Orders | null;
    orders: CheckoutOrderItem[];
    tempOrder: {
        items: CheckoutOrderItem[];
        totalAmount: number;
    };
}

const initialState: OrderState = {
    ordersByStatus: {},
    isLoading: false,
    isLoadingMore: false,
    error: null,
    totalAmount: 0,
    fromCart: false,
    selectedOrder: null,
    orders: [],
    tempOrder: {
        items: [],
        totalAmount: 0
    }
};

const initialPagination = {
    currentPage: 1,
    lastPage: 1,
    total: 0,
    perPage: 10
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrders: (state: OrderState) => {
            state.ordersByStatus = {};
            state.orders = [];
            state.totalAmount = 0;
            state.fromCart = false;
        },
        resetOrdersByStatus: (state: OrderState, action: any) => {
            if (state.ordersByStatus[action.payload]) {
                state.ordersByStatus[action.payload] = {
                    data: [],
                    pagination: { ...initialPagination }
                };
            }
        },
        setOrderProducts: (state: OrderState, action: any) => {
            if (Array.isArray(action.payload.items)) {
                state.ordersByStatus[action.payload.status] = {
                    data: action.payload.items,
                    pagination: {
                        currentPage: 1,
                        lastPage: 1,
                        total: 0,
                        perPage: 10
                    }
                };
            } else {
                console.error('setOrderProducts: items is not an array', action.payload.items);
                state.ordersByStatus[action.payload.status] = {
                    data: [],
                    pagination: {
                        currentPage: 1,
                        lastPage: 1,
                        total: 0,
                        perPage: 10
                    }
                };
            }

            state.orders = action.payload.products || [];
            state.totalAmount = action.payload.totalAmount;
            state.fromCart = action.payload.fromCart || false;
        },
        clearOrder: (state: OrderState) => {
            state.orders = [];
            state.totalAmount = 0;
            state.fromCart = false;
        },
        setTempOrder: (state: OrderState, action: any) => {
            state.tempOrder = {
                items: action.payload.items.map((item: any) => ({
                    ...item,
                    name: item.name ||
                        item.service_name ||
                        item.product?.name ||
                        item.service?.service_name,
                    image: item.image ||
                        item.product?.media?.[0]?.full_url ||
                        item.service?.media?.[0]?.full_url ||
                        (item.media && item.media[0]?.full_url),
                })),
                totalAmount: action.payload.totalAmount
            };
        },
        clearTempOrder: (state: OrderState) => {
            state.tempOrder = {
                items: [],
                totalAmount: 0
            };
        }
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(getAllOrderThunk.pending, (state: OrderState, action: any) => {
                const { status, page } = action.meta.arg || {};
                const isLoadMore = page > 1;

                if (!state.ordersByStatus[status]) {
                    state.ordersByStatus[status] = {
                        data: [],
                        pagination: { ...initialPagination }
                    };
                }

                if (isLoadMore) {
                    state.isLoadingMore = true;
                } else {
                    state.isLoading = true;
                }
                state.error = null;
            })
            .addCase(getAllOrderThunk.fulfilled, (state: OrderState, action: any) => {
                const { status, page } = action.meta.arg;
                const isLoadMore = page > 1;
                const currentOrders = state.ordersByStatus[status];

                if (isLoadMore && currentOrders) {
                    currentOrders.data = [...currentOrders.data, ...action.payload.data];
                    state.isLoadingMore = false;
                } else {
                    state.ordersByStatus[status] = {
                        data: action.payload.data,
                        pagination: {
                            currentPage: action.payload.current_page,
                            lastPage: action.payload.last_page,
                            total: action.payload.total,
                            perPage: action.payload.per_page
                        }
                    };
                    state.isLoading = false;
                }
            })
            .addCase(getAllOrderThunk.rejected, (state: OrderState, action: any) => {
                state.isLoading = false;
                state.isLoadingMore = false;
                state.error = action.payload;
            })
            .addCase(getOrderThunk.pending, (state: OrderState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getOrderThunk.fulfilled, (state: OrderState, action: any) => {
                state.ordersByStatus[action.payload.status] = {
                    data: action.payload,
                    pagination: {
                        currentPage: 1,
                        lastPage: 1,
                        total: 0,
                        perPage: 10
                    }
                };
                state.isLoading = false;
            })
            .addCase(getOrderThunk.rejected, (state: OrderState, action: any) => {
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
            })
            .addCase(changeOrderStatusByIdThunk.pending, (state: OrderState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(changeOrderStatusByIdThunk.fulfilled, (state: OrderState, action: any) => {
                state.selectedOrder = action.payload;
                state.isLoading = false;
            })
            .addCase(changeOrderStatusByIdThunk.rejected, (state: OrderState, action: any) => {
                state.isLoading = false;
                state.error = action.payload;
            })
            .addCase(createOrder.pending, (state: OrderState) => {
                state.isLoading = true;
            })
            .addCase(createOrder.fulfilled, (state: OrderState, action: any) => {
                state.isLoading = false;
                state.selectedOrder = action.payload;
            })
            .addCase(createOrder.rejected, (state: OrderState, action: any) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearOrders, resetOrdersByStatus, setOrderProducts, clearOrder, setTempOrder, clearTempOrder } = orderSlice.actions;
export default orderSlice.reducer;
