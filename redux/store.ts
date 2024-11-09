import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { languageSlice } from "./features/language/languageSlice";
import { zaloSlice } from "./features/zalo/zaloSlice";
import { serviceSlice } from './features/service/serviceSlice';
import { authSlice } from './features/auth/authSlice';
import productReducer from "./features/products/productSlice";
import searchReducer from "./features/search/searchSlice";
import cartReducer from "./features/cart/cartSlice";
import chatReducer from './features/chat/chatSlice';
import userReducer from "./features/users/userSlice";
import aiReducer from './features/ai/aiSlice';
import ratingReducer from './features/rating/ratingSlice';


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
