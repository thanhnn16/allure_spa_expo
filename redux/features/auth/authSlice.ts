import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from '@reduxjs/toolkit';
import { loginThunk } from "./loginThunk";
import { registerThunk } from "./registerThunk";
import { logoutThunk } from "./logoutThunk";
import { AuthError } from "@/types/auth.type";
import { sendVerificationEmailThunk, verifyEmailThunk } from "./emailVerificationThunk";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: AuthError | null;
  zaloAccessToken: string | null;
  zaloRefreshToken: string | null;
  zaloExpiresIn: number | null;
  isVerifyingEmail: boolean;
  verificationError: string | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: false,
  error: null,
  zaloAccessToken: null,
  zaloRefreshToken: null,
  zaloExpiresIn: null,
  isVerifyingEmail: false,
  verificationError: null
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setGuestUser: (state: AuthState) => {
      state.isGuest = true;
      state.isAuthenticated = true;
      AsyncStorage.setItem('isGuest', 'true');
    },
    clearGuestUser: (state: AuthState) => {
      state.isGuest = false;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('isGuest');
    },
    clearAuth: (state: AuthState) => {
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      state.zaloAccessToken = null;
      state.zaloRefreshToken = null;
      state.zaloExpiresIn = null;
      AsyncStorage.multiRemove(['userToken', 'zaloTokens', 'isGuest']);
    },
    setZaloTokens: (state: AuthState, action: any) => {
      state.zaloAccessToken = action.payload.access_token;
      state.zaloRefreshToken = action.payload.refresh_token;
      state.zaloExpiresIn = action.payload.expires_in;
    },
    clearZaloTokens: (state: AuthState) => {
      state.zaloAccessToken = null;
      state.zaloRefreshToken = null;
      state.zaloExpiresIn = null;
    }
  },
  extraReducers: (builder: any) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state: AuthState, action: any) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.isGuest = false;
      })
      .addCase(loginThunk.rejected, (state: AuthState, action: any) => {
        state.isLoading = false;
        state.error = action.payload as AuthError;
      })

    // Register  
    builder
      .addCase(registerThunk.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state: AuthState, action: any) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.isGuest = false;
      })
      .addCase(registerThunk.rejected, (state: AuthState, action: any) => {
        state.isLoading = false;
        state.error = action.payload as AuthError;
      })

    // Logout
    builder
      .addCase(logoutThunk.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state: AuthState) => {
        return {
          ...initialState,
          isLoading: false
        };
      })
      .addCase(logoutThunk.rejected, (state: AuthState) => {
        return {
          ...initialState,
          isLoading: false
        };
      });

    // Send Verification Email
    builder
      .addCase(sendVerificationEmailThunk.pending, (state: AuthState) => {
        state.isVerifyingEmail = true;
        state.verificationError = null;
      })
      .addCase(sendVerificationEmailThunk.fulfilled, (state: AuthState) => {
        state.isVerifyingEmail = false;
        state.verificationError = null;
      })
      .addCase(sendVerificationEmailThunk.rejected, (state: AuthState, action: any) => {
        state.isVerifyingEmail = false;
        state.verificationError = action.payload?.message || null;
      })

    // Verify Email
    builder
      .addCase(verifyEmailThunk.pending, (state: AuthState) => {
        state.isVerifyingEmail = true;
        state.verificationError = null;
      })
      .addCase(verifyEmailThunk.fulfilled, (state: AuthState) => {
        state.isVerifyingEmail = false;
        state.verificationError = null;
      })
      .addCase(verifyEmailThunk.rejected, (state: AuthState, action: any) => {
        state.isVerifyingEmail = false;
        state.verificationError = action.payload?.message || null;
      });
  }
});

export const {
  setGuestUser,
  clearGuestUser,
  clearAuth,
  setZaloTokens,
  clearZaloTokens
} = authSlice.actions;
