import { createSlice } from '@reduxjs/toolkit';
import { getInitialLanguage } from '@/languages/i18n';

interface LanguageState {
    currentLanguage: string;
}

const initialState: LanguageState = {
    currentLanguage: getInitialLanguage() || 'en',
};

const languageSlice = createSlice({
    name: 'language',
    initialState,
    reducers: {
        setLanguage(state: LanguageState, action: any) {
            state.currentLanguage = action.payload;
        },
    },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer; 