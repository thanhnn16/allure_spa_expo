import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/axiosInstance';

export const getUpcomingAppointmentThunk = createAsyncThunk(
    'servicePackage/getUpcomingAppointment',
    async (_: any, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().get('/my-packages/upcoming-appointment');
            if (response.data.success) {
                return response.data.data;
            }
            return rejectWithValue('Failed to fetch upcoming appointment');
        } catch (error: any) {
            console.log('Get upcoming appointment error:', error);
            return rejectWithValue(error.response?.data?.message || 'Unable to fetch upcoming appointment');
        }
    }
); 