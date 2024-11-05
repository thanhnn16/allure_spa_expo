import { createSlice, PayloadAction, ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types/user.type";
import AxiosInstance from "@/utils/services/helper/AxiosInstance";
import { getUserThunk } from "./getUserThunk";
import { updateUserThunk } from "./updateUserThunk";
import {  updateAvatarUrlThunk } from "./updateAvatarUrlThunk";

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};

// Thunk để lấy thông tin người dùng
// export const getProfileThunk = createAsyncThunk("user/getProfile", async () => {
//   const response = await AxiosInstance().get<User>("user/info");
//   return response.data;
// });

// Thunk để cập nhật thông tin người dùng
// export const updateUserThunk = createAsyncThunk("user/updateProfile", async (data: User) => {
//   const response = await AxiosInstance().put<User>("user/profile", data);
//   return response.data;
// });

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder: any) => {
    builder
      .addCase(getUserThunk.pending, (state: any) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserThunk.fulfilled, (state: any, action: any) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(getUserThunk.rejected, (state: any, action: any) => {
        state.error = action.error.message || "Failed to load profile";
        state.isLoading = false;
      })
      .addCase(updateUserThunk.pending, (state: any) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserThunk.fulfilled, (state: any, action: any) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(updateUserThunk.rejected, (state: any, action: any) => {
        state.error = action.error.message || "Failed to update profile";
        state.isLoading = false;
      })
      .addCase(updateAvatarUrlThunk.pending, (state: any) => {
        state.isLoading = true;
        state.error = null;
      }
        )
        .addCase(updateAvatarUrlThunk.fulfilled, (state: any, action: any) => {
            state.user = action.payload;
            state.isLoading = false;
            }
            )
            .addCase(updateAvatarUrlThunk.rejected, (state: any, action: any) => {
                state.error = action.error.message || "Failed to update avatar";
                state.isLoading = false
                }
                )
      ;
  },
});
export const {  } = userSlice.actions;
export default userSlice.reducer;
