import { createSlice } from '@reduxjs/toolkit';
import { getServicePackagesThunk } from './getServicePackagesThunk';
import { getUpcomingAppointmentThunk } from './upcomingAppointmentThunk';

interface ServicePackageState {
    packages: any[];
    isLoading: boolean;
    error: string | null;
    upcomingAppointment: any | null;
    loadingUpcoming: boolean;
}

const initialState: ServicePackageState = {
    packages: [],
    isLoading: false,
    error: null,
    upcomingAppointment: null,
    loadingUpcoming: false,
};

export const servicePackageSlice = createSlice({
    name: 'servicePackage',
    initialState,
    reducers: {},
    extraReducers: (builder: any) => {
        builder
            .addCase(getServicePackagesThunk.pending, (state: any) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getServicePackagesThunk.fulfilled, (state: any, action: any) => {
                state.packages = action.payload;
                state.isLoading = false;
            })
            .addCase(getServicePackagesThunk.rejected, (state: any, action: any) => {
                state.error = action.error.message || 'Failed to load service packages';
                state.isLoading = false;
            });

        builder
            .addCase(getUpcomingAppointmentThunk.pending, (state: any) => {
                state.loadingUpcoming = true;
            })
            .addCase(getUpcomingAppointmentThunk.fulfilled, (state: any, action: any) => {
                state.loadingUpcoming = false;
                state.upcomingAppointment = action.payload;
            })
            .addCase(getUpcomingAppointmentThunk.rejected, (state: any) => {
                state.loadingUpcoming = false;
                state.upcomingAppointment = null;
            });
    },
});

export default servicePackageSlice.reducer; 