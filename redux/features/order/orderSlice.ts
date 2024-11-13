import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OrderProduct {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
  image: string;
  type: string;
}

interface OrderState {
  products: OrderProduct[];
  totalAmount: number;
  fromCart: boolean;
}

const initialState: OrderState = {
  products: [],
  totalAmount: 0,
  fromCart: false
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderProducts: (state: any, action: PayloadAction<{
      products: OrderProduct[];
      totalAmount: number;
      fromCart: boolean;
    }>) => {
      state.products = action.payload.products;
      state.totalAmount = action.payload.totalAmount;
      state.fromCart = action.payload.fromCart;
    },
    clearOrder: (state: any) => {
      state.products = [];
      state.totalAmount = 0;
      state.fromCart = false;
    }
  }
});

export const { setOrderProducts, clearOrder } = orderSlice.actions;
export default orderSlice.reducer; 