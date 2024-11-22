import { createSlice } from "@reduxjs/toolkit";
import { Rating } from "@/types/rating.type";
import { getAllRatingProductThunk } from "./getAllRatingProductThunk";
import { getRatingProductThunk } from "./ratingProductThunk";
import { createRatingProductThunk } from "./createRatingThunk";

interface RatingState {
  rating: Rating | null;
  ratings: Rating[];
  isLoading: boolean;
  error: string | null;
  type: 'product' | 'service';
}

const initialState: RatingState = {
  rating: null,
  ratings: [],
  isLoading: false,
  error: null,
  type: 'product'
};

export const ratingSlice = createSlice({
  name: "rating",
  initialState,
  reducers: {
    clearRating(state: RatingState) {
      state.rating = null;
      state.isLoading = false;
      state.error = null;
    },
    setType(state: RatingState, action: any) {
      state.type = action.payload;
    }
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(getRatingProductThunk.pending, (state: RatingState) => {
        state.isLoading = true;
      })
      .addCase(getRatingProductThunk.fulfilled, (state: RatingState, action: any) => {
        state.isLoading = false;
        state.rating = action.payload;
      })
      .addCase(getRatingProductThunk.rejected, (state: RatingState, action: any) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch rating";
      })
      .addCase(getAllRatingProductThunk.pending, (state: RatingState) => {
        state.isLoading = true;
      })
      .addCase(getAllRatingProductThunk.fulfilled, (state: RatingState, action: any) => {
        state.isLoading = false;
        state.ratings = action.payload;
      })
      .addCase(getAllRatingProductThunk.rejected, (state: RatingState, action: any) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to fetch all ratings";
      })
      .addCase(createRatingProductThunk.pending, (state: RatingState) => {
        state.isLoading = true;
      })
      .addCase(createRatingProductThunk.fulfilled, (state: RatingState, action: any) => {
        state.isLoading = false;
        state.rating = action.payload;
      })
      .addCase(createRatingProductThunk.rejected, (state: RatingState, action: any) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to create rating";
      });
  },
});

export const { clearRating, setType } = ratingSlice.actions;
export default ratingSlice.reducer;