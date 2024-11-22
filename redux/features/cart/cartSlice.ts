import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/product.type';
import { update } from 'lodash';

export interface CartItem extends Product {
  cart_quantity: number;
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
      const { product, cart_quantity } = action.payload;
      if (!product) return;
      const existingItem = state.items.find(item => item.id === product.id);
      if (existingItem) {
        state.items = state.items.map(item => {
          if (item.id === product.id) {
            item.cart_quantity += cart_quantity;
          }
          return item;
        });
      } else {
        state.items.push({ ...product, cart_quantity });
      }
      state.totalAmount += parseFloat(product.price) * cart_quantity;
      AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(state.items));
    },
    incrementCartItem: (state: CartState, action: any) => {
      state.items = state.items.map(item => {
        if (item.id === action.payload) {
          item.cart_quantity += 1;
          state.totalAmount += parseFloat(item.price.toString());
          AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(state.items));
        }
        return item;
      });
    },
    decrementCartItem: (state: CartState, action: any) => {
      state.items = state.items.map(item => {
        if (item.id === action.payload && item.cart_quantity > 1) {
          item.cart_quantity -= 1;
          state.totalAmount -= item.price;
          AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(state.items));
        }
        return item;
      });
    },
    removeCartItem: (state: CartState, action: any) => {
      const itemToRemove = state.items.find(item => item.id === action.payload);
      if (itemToRemove) {
        state.totalAmount -= itemToRemove.price * itemToRemove.cart_quantity;
        state.items = state.items.filter(item => item.id !== action.payload);
        AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(state.items));
      }
    },
    clearCart: (state: CartState) => {
      state.items = [];
      state.totalAmount = 0;
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

export const fetchCartItems = () => async (dispatch: any) => {
  try {
    const cartItems = await AsyncStorage.getItem(CART_ITEMS_KEY);
    if (cartItems) {
      dispatch(setCartItems(JSON.parse(cartItems)));
    }
  } catch (error) {
    console.error('Error fetching cart items:', error);
  }
};

export default cartSlice.reducer;