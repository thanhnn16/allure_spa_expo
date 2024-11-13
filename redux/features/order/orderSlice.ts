import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getOrderThunk } from './getOrderThunk';
import { Orders, OrderItem } from '@/types/order.type';

interface OrderState {
  orders: Orders[];
  fromCart: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  fromCart: false,
  isLoading: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderProducts: (state, action: PayloadAction<{
      products: OrderItem[];
      totalAmount: number;
      fromCart: boolean;
    }>) => {
      state.orders = action.payload.products.map(product => ({
        id: product.id,
        user_id: '',
        total_amount: product.price,
        shipping_address_id: null,
        payment_method_id: 0,
        voucher_id: null,
        discount_amount: '0',
        status: '',
        note: '',
        created_at: '',
        updated_at: '',
        order_items: [],
        invoice: null,
      }));
      state.totalAmount = action.payload.totalAmount;
      state.fromCart = action.payload.fromCart;
    },
    clearOrder: (state) => {
      state.orders = [];
      state.totalAmount = 0;
      state.fromCart = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderThunk.pending, (state: any) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderThunk.fulfilled, (state: any, action: PayloadAction<Orders[]>) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(getOrderThunk.rejected, (state: any, action: PayloadAction<string>) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch orders";
      });
  },
});

export const { setOrderProducts, clearOrder } = orderSlice.actions;
export default orderSlice.reducer;