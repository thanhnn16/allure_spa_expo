import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserLoginResponseParams, UserRegisterResponseParams } from "@/app/authen/models/Models";
import { loginThunk } from "./LoginThunk";
import { registerThunk } from "./RegisterThunk";

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Thunk Handlers
      .addCase(loginThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state, action: PayloadAction<UserLoginResponseParams>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Login failed";
      })
      .addCase(registerThunk.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerThunk.fulfilled, (state, action: PayloadAction<UserRegisterResponseParams>) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Registration failed";
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
