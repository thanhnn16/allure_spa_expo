import { createSlice} from "@reduxjs/toolkit";
import { getServiceCateThunk } from "@/redux/service/getServiceCateThunk";
import { getServicesThunk } from './getServicesThunk';
import { getServiceDetailThunk } from "./getServiceDetailThunk";
import { ServiceCategoriesResponeParams, ServiceDetailResponeModel, ServicesResponeParams } from "@/types/service.type";
import { RootState } from "../store";
import { PayloadAction } from "@reduxjs/toolkit";

interface initialStateType {
    serviceCategories: ServiceCategoriesResponeParams | null;
    servicesList: ServicesResponeParams | null;
    serviceDetail: ServiceDetailResponeModel | null;
    current_page: number;
    isLoading: boolean;
    error: any;
}

const initialState: initialStateType = {
    serviceCategories: null,
    servicesList: null,
    serviceDetail: null,
    current_page: 0,
    isLoading: false,
    error: null
}

export const serviceSlice = createSlice({
    name: 'service',
    initialState: initialState, 
    reducers: {
        setServiceCategories(state: initialStateType, action: PayloadAction<ServiceCategoriesResponeParams>) {
            state.serviceCategories = action.payload;
        },
        setServices(state: initialStateType, action: PayloadAction<ServicesResponeParams>) {
            state.servicesList = action.payload;
        },
        setPage(state: initialStateType, action: PayloadAction<number>) {
            state.current_page = action.payload;
        },
        setServiceDetail(state: initialStateType, action: any) {
            state.serviceDetail = action.payload
        },
    },
    extraReducers: (builder: any) => {
        builder
            .addCase(getServiceCateThunk.pending, (state: initialStateType) => {
                state.isLoading = true;
            })
            .addCase(getServiceCateThunk.fulfilled, (state: initialStateType, action: PayloadAction<ServiceCategoriesResponeParams>) => {
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
            .addCase(getServicesThunk.fulfilled, (state: initialStateType, action: PayloadAction<ServicesResponeParams>) => {
                state.isLoading = false;
                state.servicesList = action.payload;
            })
            .addCase(getServicesThunk.rejected, (state: initialStateType, action: any) => {
                state.isLoading = false;
                state.error = action.error;
            })

            .addCase(getServiceDetailThunk.pending, (state: initialStateType) => {
                console.log('get service detail pending')
                state.isLoading = true;
            })
            .addCase(getServiceDetailThunk.fulfilled, (state: initialStateType, action: any) => {
                console.log('get service detail')
                state.isLoading = false;
                state.serviceDetail = action.payload;
            })
            .addCase(getServiceDetailThunk.rejected, (state: initialStateType, action: any) => {
                console.log('get service detail rejected')
                state.isLoading = false;
                state.error = action.error;
            })
    }
})
