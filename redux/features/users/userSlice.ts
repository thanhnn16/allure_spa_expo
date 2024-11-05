import { createSlice } from "@reduxjs/toolkit";
import { User } from "@/types/user.type";
import { getUserThunk } from "./getUserThunk";
import { updateUserThunk } from "./updateUserThunk";
import { updateAvatarUrlThunk } from "./updateAvatarUrlThunk";

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
export const { } = userSlice.actions;
export default userSlice.reducer;
