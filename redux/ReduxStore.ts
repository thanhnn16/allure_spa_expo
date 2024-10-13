import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./users/UserSlice";
import { treatmentSlice } from "./treatment/TreatmentSlice";

export const reduxStore = configureStore({
    reducer: {
        user: userSlice.reducer,
        treatment: treatmentSlice.reducer
    }
})

export type RootState = ReturnType<typeof reduxStore.getState>
export type AppDispatch = typeof reduxStore.dispatch