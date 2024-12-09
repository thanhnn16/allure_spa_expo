import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from "@/utils/services/helper/axiosInstance";

export const getServicePackageDetailThunk = createAsyncThunk(
    'servicePackage/getDetail',
    async (packageId: number) => {
        const response = await AxiosInstance().get(`/service-packages/${packageId}`);
        return response.data.data;
    }
); 