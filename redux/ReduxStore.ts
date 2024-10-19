import { configureStore } from "@reduxjs/toolkit";
import { treatmentSlice } from "./treatment/TreatmentSlice";
import userReducer from "./users/UserSlice";

export const reduxStore = configureStore({
  reducer: {
    user: userReducer,
    treatment: treatmentSlice.reducer
  }
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;