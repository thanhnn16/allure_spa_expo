import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { searchItems } from './searchThunk';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SearchState {
  results: {
    products: any[];
    services: any[];
  };
  recentSearches: string[];
  loading: boolean;
  error: string | null;
  currentSearchText: string;
}

const initialState: SearchState = {
  results: {
    products: [],
    services: []
  },
  recentSearches: [],
  loading: false,
  error: null,
  currentSearchText: ''
};

const RECENT_SEARCHES_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 10;

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: (state: SearchState) => {
      state.results = initialState.results;
    },
    setRecentSearches: (state: SearchState, action: any) => {
      state.recentSearches = action.payload;
    },
    addRecentSearch: (state: SearchState, action: any) => {
      const search = action.payload.trim();
      if (!search) return;

      // Remove if exists and add to front
      state.recentSearches = [
        search,
        ...state.recentSearches.filter(item => item !== search)
      ].slice(0, MAX_RECENT_SEARCHES);

      // Save to AsyncStorage
      AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(state.recentSearches));
    },
    removeRecentSearch: (state: SearchState, action: any) => {
      state.recentSearches = state.recentSearches.filter(
        item => item !== action.payload
      );

      // Save to AsyncStorage
      AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(state.recentSearches));
    },
    clearRecentSearches: (state: SearchState) => {
      state.recentSearches = [];
      AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    },
    setCurrentSearchText: (state: SearchState, action: PayloadAction<string>) => {
      state.currentSearchText = action.payload;
    }
  },
  extraReducers: (builder: any) => {
    builder
      .addCase(searchItems.pending, (state: SearchState) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchItems.fulfilled, (state: SearchState, action: any) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchItems.rejected, (state: SearchState, action: any) => {
        state.loading = false;
        state.error = action.error.message || 'Something went wrong';
      });
  }
});

export const {
  clearSearch,
  setRecentSearches,
  addRecentSearch,
  removeRecentSearch,
  clearRecentSearches,
  setCurrentSearchText
} = searchSlice.actions;

export default searchSlice.reducer;
