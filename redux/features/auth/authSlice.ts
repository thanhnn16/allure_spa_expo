import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
      AsyncStorage.setItem("user", JSON.stringify(action.payload));
    },
    clearUser: (state: AuthState) => {
      state.user = null;
      state.isAuthenticated = false;
      AsyncStorage.removeItem('user');
    },
    setGuestUser: (state: AuthState) => {
      state.isGuest = true;
      state.isAuthenticated = true;
    },
    clearGuestUser: (state: AuthState) => {
      state.isGuest = false;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, clearUser, setGuestUser, clearGuestUser } = authSlice.actions;
