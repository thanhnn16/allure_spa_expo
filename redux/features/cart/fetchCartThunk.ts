import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { CART_ITEMS_KEY } from "./cartSlice";

export const fetchCartItems = createAsyncThunk(
    'cart/fetchItems',
    async () => {
        try {
            const cartItems = await AsyncStorage.getItem(CART_ITEMS_KEY);
            if (cartItems) {
                return JSON.parse(cartItems);
            }
            return [];
        } catch (error) {
            console.error('Error fetching cart items:', error);
            return [];
        }
    }
);