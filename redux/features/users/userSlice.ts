import { createSlice, PayloadAction, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { User, UserLoginResponseParams, UserRegisterResponseParams } from "@/types/user.type";
import { loginThunk } from "../auth/loginThunk";
import { registerThunk } from "../auth/registerThunk";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";

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
    logout: (state: UserState) => {
      // Clear FCM token from server
      if (state.user?.id) {
        AxiosInstance().delete('/users/fcm-token', {
          data: { user_id: state.user.id }
        }).catch(error => {
          console.error('Error removing FCM token:', error);
        });
      }

      // Clear local storage
      AsyncStorage.multiRemove(['userToken']);

      // Reset state
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
    builder
      .addCase(loginThunk.pending, (state: UserState) => {
        state.isLoading = true;
      })
      .addCase(loginThunk.fulfilled, (state: UserState, action: PayloadAction<UserLoginResponseParams>) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(loginThunk.rejected, (state: UserState, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || "Login failed";
      })
      .addCase(registerThunk.pending, (state: UserState) => {
        state.isLoading = true;
      })
      .addCase(registerThunk.fulfilled, (state: UserState, action: PayloadAction<UserRegisterResponseParams>) => {
        state.isLoading = false;
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(registerThunk.rejected, (state: UserState, action: PayloadAction<string | undefined>) => {
        state.isLoading = false;
        state.error = action.payload || "Registration failed";
      });
  },
});
export const { logout } = userSlice.actions;
export default userSlice.reducer;

