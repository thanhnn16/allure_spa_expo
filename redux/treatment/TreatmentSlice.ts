import { createSlice } from "@reduxjs/toolkit";
import { getCategoriesThunk } from "@/redux/treatment/getCategoriesThunk";
import { getTreatmentsThunk } from './getTreatmentsThunk';
import { TreatmentCategoriesRespone, TreatmentsResponeParams } from "@/types/treatment.type";

interface initialStateType {
    treatmentCategories: TreatmentCategoriesRespone | null;
    treatmentsList: TreatmentsResponeParams | null;
    current_page: number;
    isLoadding: boolean;
    error: any;
}

const initialState: initialStateType = {
    treatmentCategories: null,
    treatmentsList: null,
    current_page: 0,
    isLoadding: false,
    error: null
}

export const treatmentSlice = createSlice({
    name: 'treatment',
    initialState: initialState,
    reducers: {
        setTreatmentCategories(state, action) {
            state.treatmentCategories = action.payload;
        },
        setTreatments(state, action) {
            state.treatmentsList = action.payload;
        },
        setPage(state, action) {
            state.current_page = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCategoriesThunk.pending, (state) => {
                state.isLoadding = true;
            })
            .addCase(getCategoriesThunk.fulfilled, (state: any, action) => {
                state.isLoadding = false;
                state.treatmentCategories = action.payload;
            })
            .addCase(getCategoriesThunk.rejected, (state, action) => {
                state.isLoadding = false;
                state.error = action.error
            })
            .addCase(getTreatmentsThunk.pending, (state) => {
                state.isLoadding = true;
            })
            .addCase(getTreatmentsThunk.fulfilled, (state: any, action) => {
                state.isLoadding = false;
                state.treatmentsList = action.payload;
            })
            .addCase(getTreatmentsThunk.rejected, (state, action) => {
                state.isLoadding = false;
                state.error = action.error;
            })
    }
})