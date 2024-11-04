import { createSlice, PayloadAction, ActionReducerMapBuilder } from "@reduxjs/toolkit";
import { REHYDRATE } from 'redux-persist';

interface LanguageState {
    currentLanguage: string;
}

const initialState: LanguageState = {
    currentLanguage: 'en'
}

export const languageSlice = createSlice({
    name: 'language',
    initialState: initialState,
    reducers: {
        setLanguage: (state: LanguageState, action: PayloadAction<string>) => {
            state.currentLanguage = action.payload
        }
    },
    extraReducers: (builder: ActionReducerMapBuilder<LanguageState>) => {
        builder.addCase(REHYDRATE, (state: LanguageState, action: any) => {
            return action.payload?.language || state;
        })
    }
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
