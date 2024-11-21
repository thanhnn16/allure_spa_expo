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


interface UpdateAppointmentParams {
    id: number;
    staff_id: number;
    appointment_date: string;
    time_slot_id: number;
    status: string;
    appointment_type: string;
    note: string;
}

export const getAppointments = createAsyncThunk(
    'appointment/getAppointments',
    async (params: AppointmentParams, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().get('/my-appointments', { params });
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
    async ({ id, note }: CancelAppointmentParams, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().put(`/appointments/${id}/cancel`, { note });
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

export const getAppointmentDetail = createAsyncThunk(
    'appointment/getAppointmentDetail',
    async (id: number, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().get(`/appointments/${id}`);
            return response.data.data;
        } catch (error: any) {
            console.log('Get appointment detail error:', error);
            return rejectWithValue(error.response?.data?.message || 'Unable to fetch appointment detail');
        }
    }
)

export const updateAppointment = createAsyncThunk(
    'appointment/updateAppointment',
    async (data: UpdateAppointmentParams, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().put(`/appointments/${data.id}`, data);
            return response.data.data;
        } catch (error: any) {
            console.log('Update appointment error:', error);
            return rejectWithValue(error.response?.data?.message || 'Unable to update appointment');
        }
    }
);

