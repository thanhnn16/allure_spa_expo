export const FETCH_FAVORITES = 'favorite/fetchFavorites';
export const SET_FAVORITES = 'favorite/setFavorites';
export const FETCH_FAVORITES_BY_TYPE = 'favorite/fetchFavoritesByType';
export const SET_FAVORITES_BY_TYPE = 'favorite/setFavoritesByType';
export const TOGGLE_FAVORITE = 'favorite/toggleFavorite';

export const fetchFavorites = () => ({ type: FETCH_FAVORITES });
export const setFavorites = (favorites: any[]) => ({ type: SET_FAVORITES, payload: favorites });
export const fetchFavoritesByType = (type: string) => ({ type: FETCH_FAVORITES_BY_TYPE, payload: { type } });
export const setFavoritesByType = (favorites: any[]) => ({ type: SET_FAVORITES_BY_TYPE, payload: favorites });
export const toggleFavorite = (type: string, itemId: string) => ({ type: TOGGLE_FAVORITE, payload: { type, itemId } });
