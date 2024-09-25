import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "./LoginThunk";
import { registerThunk } from "./RegisterThunk";
import { isLoading } from "expo-font";


const inittialState = {
    user: null,
    isLoading: false,
    error: null as any,
    quantity: 0,
    cart: []
}

export const userSlice = createSlice({
    name: 'user',
    initialState: inittialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginThunk.pending, (state) => {
                state.isLoading = true
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error
            })
            .addCase(registerThunk.pending, (state) => {
                state.isLoading = true
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.isLoading = false
                state.user = action.payload
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error
            })
    }
})

