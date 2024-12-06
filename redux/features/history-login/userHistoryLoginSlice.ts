import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getUserHistoryLogin } from './getUserHistoryLogin';
import { UserHistoryLogin } from '@/types/user.type';

interface UserHistoryLoginState {
  history: UserHistoryLogin[];
  isLoading: boolean;
  error: string | null;
}

const initialState: UserHistoryLoginState = {
  history: [],
  isLoading: false,
  error: null,
};

export const userHistoryLoginSlice = createSlice({
  name: 'userHistoryLogin',
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(getUserHistoryLogin.pending, (state:any) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserHistoryLogin.fulfilled, (state: any, action: any) => {
        state.isLoading = false;
        state.history = action.payload;
      })
      .addCase(getUserHistoryLogin.rejected, (state: any, action: any) => {
        state.error = action.payload || "Failed to load user history login";
        state.isLoading = false;
      });
  },
});

export default userHistoryLoginSlice.reducer;