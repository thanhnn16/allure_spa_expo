import { createReducer } from '@reduxjs/toolkit';
import { toggleFavorite, fetchFavorites, setFavorites } from './favoritesActions';

interface FavoriteState {
    favorites: any[];
    loading: boolean;
    error: string | null;
}

const initialState: FavoriteState = {
    favorites: [],
    loading: false,
    error: null,
};

const favoritesReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(fetchFavorites, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(setFavorites, (state, action) => {
            state.favorites = action.payload;
            state.loading = false;
            state.error = null;
        })
        .addCase(toggleFavorite, (state, action) => {
            const { type, itemId } = action.payload;
            const isFavorited = state.favorites.some((fav) => fav.item_id === itemId && fav.type === type);
            if (isFavorited) {
                state.favorites = state.favorites.filter(
                    (fav) => !(fav.item_id === itemId && fav.type === type)
                );
            } else {
                state.favorites.push({ item_id: itemId, type });
            }
        });
});

export default favoritesReducer;
