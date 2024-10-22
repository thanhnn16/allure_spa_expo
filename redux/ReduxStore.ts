import { configureStore } from "@reduxjs/toolkit";
import { treatmentSlice } from "./treatment/TreatmentSlice";
import userReducer from "./users/UserSlice";

export const reduxStore = configureStore({
  reducer: {
    user: userReducer,
    treatment: treatmentSlice.reducer
  }
});

import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { userSlice } from "./users/UserSlice";
import { treatmentSlice } from "./treatment/TreatmentSlice";
import languageReducer from "./language/LanguageSlice";

const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
    whitelist: ['language']
}
const rootReducer = combineReducers({
    user: userSlice.reducer,
    treatment: treatmentSlice.reducer,
    language: languageReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const reduxStore = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            }
        })
});

export const persistor = persistStore(reduxStore);
export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;