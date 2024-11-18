import { createSlice } from '@reduxjs/toolkit';
import { getServicePackagesThunk } from './getServicePackagesThunk';

interface ServicePackageState {
    packages: any[];
    isLoading: boolean;
    error: string | null;
}

const initialState: ServicePackageState = {
    packages: [],
    isLoading: false,
    error: null,
};

export const servicePackageSlice = createSlice({
    name: 'servicePackage',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getServicePackagesThunk.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getServicePackagesThunk.fulfilled, (state, action) => {
                state.packages = action.payload;
                state.isLoading = false;
            })
            .addCase(getServicePackagesThunk.rejected, (state, action) => {
                state.error = action.error.message || 'Failed to load service packages';
                state.isLoading = false;
            });
    },
});

export default servicePackageSlice.reducer; 