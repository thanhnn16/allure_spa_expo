import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from "@/utils/services/helper/axiosInstance";

export const getUsageHistoryThunk = createAsyncThunk(
    'servicePackage/getUsageHistory',
    async (packageId: number) => {
        const response = await AxiosInstance().get(`/service-packages/${packageId}/usage-history`);
        return response.data.data;
    }
); 