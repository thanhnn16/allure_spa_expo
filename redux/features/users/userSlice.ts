// import { createSlice, PayloadAction, ActionReducerMapBuilder } from "@reduxjs/toolkit";
// import { User } from "@/types/user.type";

// interface UserState {
//   user: User | null;
//   isLoading: boolean;
//   error: string | null;
// }

// const initialState: UserState = {
//   user: null,
//   isLoading: false,
//   error: null,
// };

// export const userSlice = createSlice({
//   name: "user",
//   initialState,
//   reducers: {

//   },
//   extraReducers: (builder: ActionReducerMapBuilder<UserState>) => {
//     builder
//       .addCase(getProfileThunk.pending, (state: UserState) => {
//         state.isLoading = true;
//       })
//       .addCase(getProfileThunk.fulfilled, (state: UserState, action: any) => {
//         state.user = action.payload;
//         state.isLoading = false;
//       });
//     builder
//       .addCase(getProfileThunk.rejected, (state: UserState, action: any) => {
//         state.error = action.error.message;
//         state.isLoading = false;
//       });
//   },
// });
// export default userSlice.reducer;

