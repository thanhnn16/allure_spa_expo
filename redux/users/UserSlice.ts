import { createSlice } from "@reduxjs/toolkit";
import { loginThunk } from "./LoginThunk";
import { registerThunk } from "./RegisterThunk";
import { isLoading } from "expo-font";
import { UserLoginResponseParams, UserRegisterResponseParams } from "@/app/authen/models/Models";

interface UserState {
    user: UserLoginResponseParams| UserRegisterResponseParams | null
    isLoading: boolean
    error: any
    quantity: number
    cart: []
}

const inittialState: UserState = {
    user: null,
    isLoading: false,
    error: null,
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
                if (action.payload && action.payload.data) {
                    state.user = action.payload.data.user
                }
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
                if (action.payload && action.payload.data) {
                    state.user = action.payload.data.user
                }
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.error
            })
    }
})

