import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { AxiosResponse } from 'axios';

export const getUsageHistoryThunk = createAsyncThunk(
    'servicePackage/getUsageHistory',
    async (packageId: number) => {
        try {
            const response = await AxiosInstance().get(`/service-packages/${packageId}/history`);
            return response.data.data;
        } catch (error: any) {
            console.error('Error fetching usage history:', error.response.data.message);
            throw error;
        }
    }
); 