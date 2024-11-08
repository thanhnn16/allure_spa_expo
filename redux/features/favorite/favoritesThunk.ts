import axios from 'axios';
import { Dispatch } from 'redux';
import { fetchFavorites, setFavorites, fetchFavoritesByType, setFavoritesByType, toggleFavorite } from './favoritesActions';

export const fetchFavoritesThunk = () => async (dispatch: Dispatch) => {
    dispatch(fetchFavorites());
    try {
        const response = await axios.get('/api/favorites');
        dispatch(setFavorites(response.data.data));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        dispatch(setFavorites([]));
    }
};

export const fetchFavoritesByTypeThunk = (type: string) => async (dispatch: Dispatch) => {
    dispatch(fetchFavoritesByType(type));
    try {
        const response = await axios.get(`/api/favorites/${type}`);
        dispatch(setFavoritesByType(response.data.data));
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
        dispatch(setFavoritesByType([]));
    }
};

export const toggleFavoriteThunk = (type: 'product' | 'service', itemId: number) => async (
    dispatch: Dispatch
) => {
    try {
        const response = await axios.post('/api/favorites/toggle', {
            type,
            item_id: itemId,
        });
        if (response.status === 200) {
            dispatch(toggleFavorite(type, itemId.toString()));
            // Fetch updated favorites list
            // @ts-ignore
            dispatch(fetchFavoritesThunk());
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Axios error:', error.message);
        } else {
            console.error('Unexpected error:', error);
        }
    }
};
