import { createSlice } from '@reduxjs/toolkit';
import { getServicePackagesThunk } from './getServicePackagesThunk';
import { getServicePackageDetailThunk } from './getServicePackageDetailThunk';
import { getUsageHistoryThunk } from './getUsageHistoryThunk';

interface ServiceUsageHistory {
    id: number;
    start_time: string;
    end_time: string;
    staff_user_id: number;
    result: string | null;
    notes: string | null;
    staff: {
        id: number;
        full_name: string;
    };
}

interface ServicePackage {
    id: number;
    service_name: string;
    total_sessions: number;
    used_sessions: number;
    remaining_sessions: number;
    expiry_date: string | null;
    progress_percentage: number;
    package_type: {
        name: string;
        sessions: number;
        color: string;
    };
    next_session_date: string | null;
    next_appointment_details: {
        id: number;
        date: string;
        time: {
            start: string;
            end: string;
        };
        staff: {
            id: number;
            full_name: string;
        } | null;
    } | null;
    treatment_sessions: ServiceUsageHistory[];
}

interface ServicePackageState {
    packages: ServicePackage[];
    currentPackage: ServicePackage | null;
    usageHistory: ServiceUsageHistory[];
    isLoading: boolean;
    isLoadingDetail: boolean;
    isLoadingHistory: boolean;
    error: string | null;
}

const initialState: ServicePackageState = {
    packages: [],
    currentPackage: null,
    usageHistory: [],
    isLoading: true,
    isLoadingDetail: true,
    isLoadingHistory: true,
    error: null,
};

export const servicePackageSlice = createSlice({
    name: 'servicePackage',
    initialState,
    reducers: {
        clearCurrentPackage: (state: ServicePackageState) => {
            state.currentPackage = null;
            state.usageHistory = [];
        },
    },
    extraReducers: (builder: any) => {
        builder
            // Get Service Packages
            .addCase(getServicePackagesThunk.pending, (state: ServicePackageState) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getServicePackagesThunk.fulfilled, (state: ServicePackageState, action: any) => {
                state.packages = action.payload;
                state.isLoading = false;
            })
            .addCase(getServicePackagesThunk.rejected, (state: ServicePackageState, action: any) => {
                state.error = action.error.message || 'Failed to load service packages';
                state.isLoading = false;
            })
            // Get Package Detail
            .addCase(getServicePackageDetailThunk.pending, (state: ServicePackageState) => {
                state.isLoadingDetail = true;
            })
            .addCase(getServicePackageDetailThunk.fulfilled, (state: ServicePackageState, action: any) => {
                state.currentPackage = action.payload;
                state.isLoadingDetail = false;
            })
            .addCase(getServicePackageDetailThunk.rejected, (state: ServicePackageState, action: any) => {
                state.error = action.error.message;
                state.isLoadingDetail = false;
            })
            // Get Usage History
            .addCase(getUsageHistoryThunk.pending, (state: ServicePackageState) => {
                state.isLoadingHistory = true;
            })
            .addCase(getUsageHistoryThunk.fulfilled, (state: ServicePackageState, action: any) => {
                state.usageHistory = action.payload;
                state.isLoadingHistory = false;
            })
            .addCase(getUsageHistoryThunk.rejected, (state: ServicePackageState, action: any) => {
                state.error = action.error.message;
                state.isLoadingHistory = false;
            });
    },
});

export const { clearCurrentPackage } = servicePackageSlice.actions;
export default servicePackageSlice.reducer; 