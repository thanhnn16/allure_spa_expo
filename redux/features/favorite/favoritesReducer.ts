import { FETCH_FAVORITES, SET_FAVORITES, FETCH_FAVORITES_BY_TYPE, SET_FAVORITES_BY_TYPE, TOGGLE_FAVORITE } from './favoritesActions';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
interface FavoriteState {
    favorites: any[];
    favoritesByType: any[];
    loading: boolean;
    error: string | null;
}

const initialState: FavoriteState = {
    favorites: [],
    favoritesByType: [],
    loading: false,
    error: null,
};

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // @ts-ignore
        builder
            .addCase(FETCH_FAVORITES, (state: FavoriteState) => {
                state.loading = true;
            })
            .addCase(SET_FAVORITES, (state: FavoriteState, action: PayloadAction<any[]>) => {
                state.favorites = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(FETCH_FAVORITES_BY_TYPE, (state: FavoriteState) => {
                state.loading = true;
            })
            .addCase(SET_FAVORITES_BY_TYPE, (state: FavoriteState, action: PayloadAction<any[]>) => {
                state.favoritesByType = action.payload;
                state.loading = false;
                state.error = null;
            })
            .addCase(TOGGLE_FAVORITE, (state: FavoriteState, action: PayloadAction<{ type: string; itemId: string }>) => {
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
