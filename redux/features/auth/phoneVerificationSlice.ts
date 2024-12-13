import { createSlice } from "@reduxjs/toolkit";
import { sendPhoneVerificationThunk, verifyPhoneThunk } from "./phoneVerificationThunk";

interface PhoneVerificationState {
    isLoading: boolean;
    error: string | null;
    verificationId: string | null;
}

const initialState: PhoneVerificationState = {
    isLoading: false,
    error: null,
    verificationId: null
};

const phoneVerificationSlice = createSlice({
    name: "phoneVerification",
    initialState,
    reducers: {
        clearPhoneVerification: (state: PhoneVerificationState) => {
            state.error = null;
            state.verificationId = null;
        }
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(sendPhoneVerificationThunk.pending, (state: PhoneVerificationState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(sendPhoneVerificationThunk.fulfilled, (state: PhoneVerificationState, action: any) => {
                state.isLoading = false;
                state.verificationId = action.payload.verification_id;
            })
            .addCase(sendPhoneVerificationThunk.rejected, (state: PhoneVerificationState, action: any) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(verifyPhoneThunk.pending, (state: PhoneVerificationState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(verifyPhoneThunk.fulfilled, (state: PhoneVerificationState) => {
                state.isLoading = false;
                state.verificationId = null;
            })
            .addCase(verifyPhoneThunk.rejected, (state: PhoneVerificationState, action: any) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    }
});

export const { clearPhoneVerification } = phoneVerificationSlice.actions;
export default phoneVerificationSlice.reducer; 