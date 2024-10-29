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
}

const initialState: SearchState = {
  results: {
    products: [],
    services: []
  },
  recentSearches: [],
  loading: false,
  error: null
};

const RECENT_SEARCHES_KEY = '@recent_searches';
const MAX_RECENT_SEARCHES = 10;

export const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearSearch: (state) => {
      state.results = initialState.results;
    },
    setRecentSearches: (state, action: PayloadAction<string[]>) => {
      state.recentSearches = action.payload;
    },
    addRecentSearch: (state, action: PayloadAction<string>) => {
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
    removeRecentSearch: (state, action: PayloadAction<string>) => {
      state.recentSearches = state.recentSearches.filter(
        item => item !== action.payload
      );
      
      // Save to AsyncStorage
      AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(state.recentSearches));
    },
    clearRecentSearches: (state) => {
      state.recentSearches = [];
      AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(searchItems.rejected, (state, action) => {
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
  clearRecentSearches 
} = searchSlice.actions;

export default searchSlice.reducer;
