import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from '@reduxjs/toolkit';
import { loginThunk } from "./loginThunk";
import { registerThunk } from "./registerThunk";
import { logoutThunk } from "./logoutThunk";
import { AuthError } from "@/types/auth.type";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: AuthError | null;
  zaloAccessToken: string | null;
  zaloRefreshToken: string | null;
  zaloExpiresIn: number | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  isGuest: false,
  isLoading: false,
  error: null,
  zaloAccessToken: null,
  zaloRefreshToken: null,
  zaloExpiresIn: null
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
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.isGuest = false;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AuthError;
      })

    // Register  
    builder
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
        state.isGuest = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as AuthError;
      })

    // Logout
    builder
      .addCase(logoutThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        return {
          ...initialState,
          isLoading: false
        };
      })
      .addCase(logoutThunk.rejected, (state) => {
        return {
          ...initialState,
          isLoading: false
        };
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
