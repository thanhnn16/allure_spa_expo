import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/product.type';
import { update } from 'lodash';

export interface CartItem extends Product {
  [x: string]: any;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

const CART_ITEMS_KEY = '@cart_items';

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state: CartState, action: any) => {
      state.items = action.payload;
    },
    addItemToCart: (state: CartState, action: any) => {
      const { product, quantity } = action.payload;
      if (!product) return;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        state.items = state.items.map(item => {
          if (item.id === product.id) {
            if (quantity) {
              item.quantity += quantity;
            } else {
              item.quantity += 1;
            }
          }
          return item;
        });
      } else {
        state.items.push({ ...product, quantity: 1 });
      }
      state.totalAmount += parseFloat(product.price);
      AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(state.items));
    },
    incrementCartItem: (state: CartState, action: any) => {
      state.items = state.items.map(item => {
        if (item.id === action.payload) {
          item.quantity += 1;
          state.totalAmount += parseFloat(item.price);
          AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(state.items));
        }
        return item;
      });
    },
    decrementCartItem: (state: CartState, action: any) => {
      state.items = state.items.map(item => {
        if (item.id === action.payload && item.quantity > 1) {
          item.quantity -= 1;
          state.totalAmount -= parseFloat(item.price);
          AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(state.items));
        }
        return item;
      });
    },
    removeCartItem: (state: CartState, action: any) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(state.items));
    },
    clearCart: (state: CartState) => {
      state.items = [];
      AsyncStorage.removeItem(CART_ITEMS_KEY);
    },
  },
});

export const {
  setCartItems,
  addItemToCart,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
  clearCart

} = cartSlice.actions;

export default cartSlice.reducer;