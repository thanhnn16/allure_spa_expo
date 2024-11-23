import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { REHYDRATE } from 'redux-persist';
import { getInitialLanguage } from '@/languages/i18n';

interface LanguageState {
    currentLanguage: string;
}

const initialState: LanguageState = {
    currentLanguage: getInitialLanguage() || 'en'
}

export const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage: (state: LanguageState, action: any) => {
            state.currentLanguage = action.payload;
        }
    },
    extraReducers: (builder: any) => {
        builder.addCase(REHYDRATE, (state: LanguageState, action: any) => {
            return action.payload?.language || state;
        });
    }
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
