import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { userSlice } from "./users/UserSlice";
import languageReducer from "./language/LanguageSlice";
import zaloReducer from "./zalo/ZaloSlice";
import { serviceSlice } from './service/ServiceSlice';
import authReducer from './auth/authSlice';
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['language', 'zalo', 'auth']
}

const rootReducer: any = combineReducers({
    user: userSlice.reducer,
    language: languageReducer,
    zalo: zaloReducer,
    service: serviceSlice.reducer,
    auth: authReducer
})


export type RootState = ReturnType<typeof rootReducer>;

const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        })
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
