import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/axiosInstance';

interface AppointmentParams {
    from_date?: string;
    to_date?: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}


interface CancelAppointmentParams {
    id: number;
    note: string;
}

export const getAppointments = createAsyncThunk(
    'appointment/getAppointments',
    async (params: AppointmentParams, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance().get('/my-appointments', { params });
            console.log('Get appointments response:', response.data);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue('Failed to fetch appointments');
            }
        } catch (error: any) {
            console.log('Get appointments error:', error);
            return rejectWithValue(error.response?.data?.message || 'Unable to fetch appointments');
        }
    }
);


export const cancelAppointment = createAsyncThunk(
    'appointment/cancelAppointment',
    async ({ id, note }: CancelAppointmentParams, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance().put(`/appointments/${id}/cancel`, { note });
            console.log('Cancel appointment response:', response.data);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue('Failed to cancel appointment');
            }
        } catch (error: any) {
            console.log('Cancel appointment error:', error.response.data.message);
            return rejectWithValue(error.response?.data?.message || 'Unable to cancel appointment');
        }
    }
);
