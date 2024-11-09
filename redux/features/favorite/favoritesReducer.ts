import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchFavoritesThunk, toggleFavoriteThunk } from "@/redux/features/favorite/favoritesThunk";

interface FavoriteState {
    favorites: any[];
    favoritesByType: any[];
    loading: boolean;
    error: string | null;
    status: string | null;
}

const initialState: FavoriteState = {
    favorites: [],
    favoritesByType: [],
    loading: false,
    error: null,
    status: null,
};

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    extraReducers: (builder: any) => {
        builder
            .addCase(fetchFavoritesThunk.pending, (state: FavoriteState) => {
                state.loading = true;
            })
            .addCase(fetchFavoritesThunk.fulfilled, (state: FavoriteState, action: PayloadAction<any[]>) => {
                state.favorites = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchFavoritesThunk.rejected, (state: FavoriteState) => {
                state.loading = true;
            })
            .addCase(toggleFavoriteThunk.fulfilled, (state: FavoriteState, action: any) => {
                state.loading = false;
                state.status = action.payload;
            })
            .addCase(toggleFavoriteThunk.rejected, (state: FavoriteState, action: any) => {
                const { type, itemId } = action.payload;
                const isFavorite = state.favorites.some((fav: any) => fav.item_id === itemId && fav.type === type);
                if (isFavorite) {
                    state.favorites = state.favorites.filter(
                        (fav: any) => !(fav.item_id === itemId && fav.type === type)
                    );
                } else {
                    state.favorites.push({ item_id: itemId, type });
                }
            });
    },
});

export default favoriteSlice.reducer;
