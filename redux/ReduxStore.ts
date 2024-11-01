import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./users/UserSlice";

export const reduxStore = configureStore({
    reducer: {
        user: userSlice.reducer
    }
})