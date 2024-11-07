import { createAction } from '@reduxjs/toolkit';

// @ts-ignore
export const toggleFavorite = createAction<{
    type: 'product' | 'service';
    itemId: number;
}>('favorites/toggle');

export const fetchFavorites = createAction('favorites/fetchFavorites');

// @ts-ignore
export const setFavorites = createAction<any>('favorites/setFavorites');
