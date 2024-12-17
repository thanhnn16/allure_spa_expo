import { createSlice } from "@reduxjs/toolkit";
import { getServiceCateThunk } from "@/redux/features/service/getServiceCateThunk";
import { getServicesThunk } from './getServicesThunk';
import { ServiceCategoriesResponeParams, ServiceDetailResponeModel } from "@/types/service.type";
import { getServiceDetailThunk } from './getServiceDetailThunk';

interface initialStateType {
    serviceCategories: ServiceCategoriesResponeParams | null;
    servicesList: any[];
    currentPage: number;
    hasMore: boolean;
    isLoading: boolean;
    error: any;
    serviceDetail: ServiceDetailResponeModel | null;
}

const initialState: initialStateType = {
    serviceCategories: null,
    servicesList: [],
    currentPage: 1,
    hasMore: true,
    isLoading: true,
    error: null,
    serviceDetail: null,
}

export const serviceSlice = createSlice({
    name: 'service',
    initialState: initialState,
    reducers: {
        setServiceCategories(state: initialStateType, action: any) {
            state.serviceCategories = action.payload;
        },
        setServices(state: initialStateType, action: any) {
            state.servicesList = action.payload;
        },
        setPage(state: initialStateType, action: any) {
            state.currentPage = action.payload;
        }
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(getServiceCateThunk.pending, (state: initialStateType) => {
                state.isLoading = true;
            })
            .addCase(getServiceCateThunk.fulfilled, (state: initialStateType, action: any) => {
                state.isLoading = false;
                state.serviceCategories = action.payload;
            })
            .addCase(getServiceCateThunk.rejected, (state: initialStateType, action: any) => {
                state.isLoading = false;
                state.error = action.error
            })
            .addCase(getServicesThunk.pending, (state: initialStateType) => {
                state.isLoading = true;
            })
            .addCase(getServicesThunk.fulfilled, (state: initialStateType, action: any) => {
                state.isLoading = false;
                const { data, page, hasMore } = action.payload;

                if (page === 1) {
                    state.servicesList = data.data;
                } else {
                    state.servicesList = [...state.servicesList, ...data.data];
                }

                state.currentPage = page;
                state.hasMore = hasMore;
            })
            .addCase(getServicesThunk.rejected, (state: initialStateType, action: any) => {
                state.isLoading = false;
                state.error = action.error;
            })
            .addCase(getServiceDetailThunk.pending, (state: initialStateType) => {
                state.isLoading = true;
            })
            .addCase(getServiceDetailThunk.fulfilled, (state: initialStateType, action: any) => {
                state.isLoading = false;
                state.serviceDetail = action.payload;
            })
            .addCase(getServiceDetailThunk.rejected, (state: initialStateType, action: any) => {
                state.isLoading = false;
                state.error = action.error;
            })
    }
})
