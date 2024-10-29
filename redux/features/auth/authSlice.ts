import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import FirebaseService from '@/utils/services/firebase/firebaseService';
import { logoutThunk } from "./logoutThunk";
import { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { loginThunk } from "./loginThunk";

interface AuthState {
  user: any | null;
  isAuthenticated: boolean;
  isGuest: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isGuest: false,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state: AuthState, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearUser: (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('user');
    },
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
  },
  extraReducers: (builder: ActionReducerMapBuilder<AuthState>) => {
    builder.addCase(loginThunk.fulfilled, (state: AuthState, action: any) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
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
  clearGuestUser
} = authSlice.actions;
