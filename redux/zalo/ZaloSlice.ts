import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccessTokenResponse } from '@/utils/services/zalo/zaloAuthService';

interface ZaloState {
  accessToken: string | null;
  refreshToken: string | null;
  expiresIn: number | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: ZaloState = {
  accessToken: null,
  refreshToken: null,
  expiresIn: null,
  isAuthenticated: false,
  error: null,
};

export const zaloSlice = createSlice({
  name: 'zalo',
  initialState,
  reducers: {
    setZaloTokens: (state: ZaloState, action: PayloadAction<AccessTokenResponse>) => {
      state.accessToken = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
      state.expiresIn = action.payload.expires_in;
      state.isAuthenticated = true;
      state.error = null;
    },
    clearZaloTokens: (state: ZaloState) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.expiresIn = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    setZaloError: (state: ZaloState, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
  },
});

export const { setZaloTokens, clearZaloTokens, setZaloError } = zaloSlice.actions;

export default zaloSlice.reducer;
