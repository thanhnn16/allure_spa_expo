import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from '@reduxjs/toolkit';
import { logoutThunk } from "./logoutThunk";
import { loginThunk } from "./loginThunk";
import { registerThunk } from "./registerThunk";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  isLoading: boolean;
  error: string | null;
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
        state.error = action.payload as string;
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
        state.error = action.payload as string;
      })
    // Logout
    builder
      .addCase(logoutThunk.pending, (state: AuthState) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutThunk.fulfilled, (state: AuthState) => {
        // Reset to initial state
        state.token = null;
        state.isAuthenticated = false;
        state.isGuest = false;
        state.isLoading = false;
        state.error = null;
        state.zaloAccessToken = null;
        state.zaloRefreshToken = null;
        state.zaloExpiresIn = null;
      })
      .addCase(logoutThunk.rejected, (state: AuthState) => {
        // Still reset state even if API call fails
        state.token = null;
        state.isAuthenticated = false;
        state.isGuest = false;
        state.isLoading = false;
        state.error = null;
        state.zaloAccessToken = null;
        state.zaloRefreshToken = null;
        state.zaloExpiresIn = null;
      });
  }
});

export const {
  login,
  register,
  logout,
  zaloLogin,
  setUser,
  clearUser,
  setGuestUser,
  clearGuestUser,
  setZaloTokens,
  clearZaloTokens
} = authSlice.actions;
