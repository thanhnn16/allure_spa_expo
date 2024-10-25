import i18n from "@/languages/i18n";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from 'redux-persist';;

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
        setLanguage: (state, action: PayloadAction<string>) => {
            state.currentLanguage = action.payload
        }
    },
    extraReducers: (builder) => {
        builder.addCase(REHYDRATE, (state, action: any) => {
            // Nếu có state đã lưu, sử dụng nó; nếu không, giữ nguyên state hiện tại
            return action.payload?.language || state;
        })
    }
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
