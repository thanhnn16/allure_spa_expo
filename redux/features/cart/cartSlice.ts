import { createSlice } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '@/types/product.type';
import { fetchCartItems } from './fetchCartThunk';
import { CART_ITEMS_KEY } from './constants';
import { CheckoutItem } from '@/types/checkout.type';
import { RootState } from '@/redux/store';
import { Media } from '@/types/media.type';
import { createSelector } from '@reduxjs/toolkit';

export interface CartItem {
  id: number;
  item_type: 'product' | 'service';
  name: string;
  price: number;
  cart_quantity: number;
  quantity?: number;
  service_type?: 'single' | 'combo_5' | 'combo_10';
  media: Media[];
}

interface CartState {
  items: CartItem[];
  totalAmount: number;
}

const initialState: CartState = {
  items: [],
  totalAmount: 0,
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state: CartState, action: any) => {
      state.items = action.payload;
      state.totalAmount = action.payload.reduce((total: number, item: CartItem) => {
        return total + (parseFloat(item.price.toString()) * item.cart_quantity);
      }, 0);
    },
    addItemToCart: (state: CartState, action: any) => {
      const { item, cart_quantity, item_type, service_type } = action.payload;
      if (!item) return;

      const cartItem: CartItem = {
        id: item.id,
        item_type: item_type || 'product',
        name: item_type === 'service' ? item.service_name : item.name,
        price: parseFloat(item.price),
        cart_quantity,
        quantity: item.quantity,
        service_type,
        media: item.media || [],
      };

      const existingItem = state.items.find(i =>
        i.id === cartItem.id && i.item_type === cartItem.item_type
      );

      if (existingItem) {
        const newQuantity = existingItem.cart_quantity + cart_quantity;
        if (newQuantity > (cartItem.quantity || 0)) {
          return;
        }

        state.items = state.items.map(item => {
          if (item.id === cartItem.id && item.item_type === cartItem.item_type) {
            item.cart_quantity = newQuantity;
          }
          return item;
        });
      } else {
        if (cart_quantity > (cartItem.quantity || 0)) {
          return;
        }
        state.items.push(cartItem);
      }

      state.totalAmount += cartItem.price * cart_quantity;
      AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(state.items));
    },
    incrementCartItem: (state: CartState, action: any) => {
      state.items = state.items.map(item => {
        if (item.id === action.payload) {
          if (item.cart_quantity < (item.quantity || 0)) {
            item.cart_quantity += 1;
            state.totalAmount += parseFloat(item.price.toString());
            AsyncStorage.setItem(CART_ITEMS_KEY, JSON.stringify(state.items));
          }
        }
        return item;
      });
    },
    decrementCartItem: (state: CartState, action: any) => {
      state.items = state.items.map(item => {
        if (item.id === action.payload && item.cart_quantity > 1) {
          item.cart_quantity -= 1;
          state.totalAmount -= parseFloat(item.price.toString());
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
  extraReducers: (builder: any) => {
    builder.addCase(fetchCartItems.fulfilled, (state: CartState, action: any) => {
      state.items = action.payload;
      state.totalAmount = action.payload.reduce((total: number, item: CartItem) => {
        return total + (parseFloat(item.price.toString()) * item.cart_quantity);
      }, 0);
    });
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

export const selectCheckoutItems = createSelector(
  [(state: RootState) => state.cart.items],
  (items: CartItem[]) => items.map(item => ({
    item_id: item.id,
    item_type: item.item_type,
    quantity: item.cart_quantity,
    price: item.price,
    service_type: item.service_type,
    product: item.item_type === 'product' ? item : undefined,
    service: item.item_type === 'service' ? item : undefined,
  }))
);

export const selectTotalCartItems = createSelector(
  [(state: RootState) => state.cart.items],
  (items: CartItem[]) => items.reduce((total, item) => total + item.cart_quantity, 0)
);

export default cartSlice.reducer;