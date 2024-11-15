import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/axiosInstance';

interface AppointmentParams {
    from_date?: string;
    to_date?: string;
    status?: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export const getAppointments = createAsyncThunk(
    'appointment/getAppointments',
    async (params: AppointmentParams, { rejectWithValue }) => {
        try {
            const response = await AxiosInstance().get('/my-appointments', { params });
            console.log('Get appointments response:', response.data);
            if (response.data.success) {
                return response.data.data.map((appointment: any) => ({
                    id: appointment.id,
                    title: appointment.title,
                    start: appointment.start,
                    end: appointment.end,
                    service: appointment.extendedProps.service,
                    status: appointment.extendedProps.status,
                    time_slot: appointment.extendedProps.timeSlot,
                    note: appointment.extendedProps.user.note,
                }));
            } else {
                return rejectWithValue('Failed to fetch appointments');
            }
        } catch (error: any) {
            console.log('Get appointments error:', error);
            return rejectWithValue(error.response?.data?.message || 'Unable to fetch appointments');
        }
    }
);
