import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { languageSlice } from "@/redux/features";
import { zaloSlice } from "@/redux/features";
import { serviceSlice } from './features/service/serviceSlice';
import { authSlice } from '@/redux/features';
import productReducer from "./features/products/productSlice";
import searchReducer from "./features/search/searchSlice";
import cartReducer from "./features/cart/cartSlice";
import chatReducer from './features/chat/chatSlice';
import userReducer from "./features/users/userSlice";
import aiReducer from './features/ai/aiSlice';
import ratingReducer from './features/rating/ratingSlice';
import favoriteReducer from './features/favorite/favoritesReducer';
import addressReducer from './features/address/addressSlice';
import orderReducer from './features/order/orderSlice';
import voucherReducer from "./features/voucher/voucherSlice";
import bookingReducer from './features/booking/bookingSlice';
import appointmentReducer from './features/appointment/appointmentSlice'; // Import the appointment reducer

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['language', 'zalo', 'auth'],
    timeout: 10000,
    debug: __DEV__
}

const rootReducer: any = combineReducers({
    user: userReducer,
    language: languageSlice.reducer,
    zalo: zaloSlice.reducer,
    service: serviceSlice.reducer,
    auth: authSlice.reducer,
    product: productReducer,
    search: searchReducer,
    cart: cartReducer,
    chat: chatReducer,
    ai: aiReducer,
    rating: ratingReducer,
    favorite: favoriteReducer,
    address: addressReducer,
    order: orderReducer,
    voucher: voucherReducer,
    booking: bookingReducer,
    appointment: appointmentReducer,
})

export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            thunk: {
                extraArgument: undefined
            }
        }),
    devTools: __DEV__,
    preloadedState: undefined
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;

export const isStoreReady = () => {
    return new Promise((resolve) => {
        const unsubscribe = persistor.subscribe(() => {
            const { bootstrapped } = persistor.getState();
            if (bootstrapped) {
                unsubscribe();
                resolve(true);
            }
        });
    });
};
