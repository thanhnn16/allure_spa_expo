import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getServiceCateThunk } from "@/redux/features/service/getServiceCateThunk";
import { getServicesThunk } from './getServicesThunk';
import { ServiceCategoriesResponeParams, ServicesResponeParams } from "@/types/service.type";
import { RootState } from "../../store";

interface initialStateType {
    serviceCategories: ServiceCategoriesResponeParams | null;
    servicesList: ServicesResponeParams | null;
    currentPage: number;
    hasMore: boolean;
    isLoading: boolean;
    error: any;
}

const initialState: initialStateType = {
    serviceCategories: null,
    servicesList: null,
    currentPage: 1,
    hasMore: true,
    isLoading: false,
    error: null
}

export const serviceSlice = createSlice({
    name: 'service',
    initialState: initialState,
    reducers: {
        setServiceCategories(state: RootState, action: PayloadAction<ServiceCategoriesResponeParams>) {
            state.serviceCategories = action.payload;
        },
        setServices(state: RootState, action: PayloadAction<ServicesResponeParams>) {
            state.servicesList = action.payload;
        },
        setPage(state: RootState, action: PayloadAction<number>) {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(getServiceCateThunk.pending, (state: RootState) => {
                state.isLoading = true;
            })
            .addCase(getServiceCateThunk.fulfilled, (state: RootState, action: PayloadAction<ServiceCategoriesResponeParams>) => {
                state.isLoading = false;
                state.serviceCategories = action.payload;
            })
            .addCase(getServiceCateThunk.rejected, (state: RootState, action: any) => {
                state.isLoading = false;
                state.error = action.error
            })
            .addCase(getServicesThunk.pending, (state: RootState) => {
                state.isLoading = true;
            })
            .addCase(getServicesThunk.fulfilled, (state: RootState, action: PayloadAction<any>) => {
                state.isLoading = false;
                const { data } = action.payload;

                state.servicesList = {
                    data: data
                };
            })
            .addCase(getServicesThunk.rejected, (state: RootState, action: any) => {
                state.isLoading = false;
                state.error = action.error;
            })
    }
})
