import { toggleFavorite, fetchFavorites, setFavorites } from './favoritesActions';
import { Dispatch } from 'redux';
import axios from 'axios';

export const fetchFavoritesThunk = () => async (dispatch: Dispatch) => {
    dispatch(fetchFavorites());
    try {
        const response = await axios.get(`/api/favorites`);
        dispatch(setFavorites(response.data.data));
    } catch (error) {
        console.error(error);
        dispatch(setFavorites([])); // Or dispatch an error action
    }
};

export const toggleFavoriteThunk = (type: 'product' | 'service', itemId: number) => async (
    dispatch: Dispatch
) => {
    try {
        const response = await axios.post(`/api/favorites/toggle`, {
            type,
            item_id: itemId,
        });
        if (response.status === 200) {
            dispatch(toggleFavorite({ type, itemId }));
        }
    } catch (error) {
        console.error(error);
    }
};
