import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { userSlice } from "./users/UserSlice";
import languageReducer from "./language/LanguageSlice";
import zaloReducer from "./zalo/ZaloSlice";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['language', 'zalo']
}

const rootReducer = combineReducers({
    user: userSlice.reducer,
    treatment: treatmentSlice.reducer,
    language: languageReducer,
    zalo: zaloReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const reduxStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware: any) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        })
});

export const persistor = persistStore(reduxStore);
export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
