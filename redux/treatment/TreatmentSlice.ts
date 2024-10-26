import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getTreatmentCateThunk } from "@/redux/treatment/getTreatmentCateThunk";
import { getTreatmentsThunk } from './getTreatmentsThunk';
import { TreatmentCategoriesResponeParams, TreatmentsResponeParams } from "@/types/treatment.type";
import { RootReducerType } from "../ReduxStore";
interface initialStateType {
    treatmentCategories: TreatmentCategoriesResponeParams | null;
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
        setTreatmentCategories(state: RootReducerType, action: PayloadAction<TreatmentCategoriesResponeParams>) {
            state.treatmentCategories = action.payload;
        },
        setTreatments(state: RootReducerType, action: PayloadAction<TreatmentsResponeParams>) {
            state.treatmentsList = action.payload;
        },
        setPage(state: RootReducerType, action: PayloadAction<number>) {
            state.current_page = action.payload;
        }
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(getTreatmentCateThunk.pending, (state: RootReducerType) => {
                state.isLoadding = true;
            })
            .addCase(getTreatmentCateThunk.fulfilled, (state: RootReducerType, action: PayloadAction<TreatmentCategoriesResponeParams>) => {
                state.isLoadding = false;
                state.treatmentCategories = action.payload;
            })
            .addCase(getTreatmentCateThunk.rejected, (state: RootReducerType, action: any) => {
                state.isLoadding = false;
                state.error = action.error
            })
            .addCase(getTreatmentsThunk.pending, (state: RootReducerType) => {
                state.isLoadding = true;
            })
            .addCase(getTreatmentsThunk.fulfilled, (state: RootReducerType, action: PayloadAction<TreatmentsResponeParams>) => {
                state.isLoadding = false;
                state.treatmentsList = action.payload;
            })
            .addCase(getTreatmentsThunk.rejected, (state: RootReducerType, action: any) => {
                state.isLoadding = false;
                state.error = action.error;
            })
    }
})

