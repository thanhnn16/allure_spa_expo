import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import appointmentReducer from './features/appointment/appointmentSlice';
import notificationReducer from './features/notification/notificationSlice';
import bannerReducer from '@/redux/features/banner/bannerSlice';
import servicePackageReducer from './features/servicePackage/servicePackageSlice';
import languageReducer from './features/language/languageSlice';

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['zalo', 'auth', 'user', 'language'],
    timeout: 10000,
}

const rootReducer: any = combineReducers({
    banners: bannerReducer,
    user: userReducer,
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
    notification: notificationReducer,
    servicePackage: servicePackageReducer,
    language: languageReducer,
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
