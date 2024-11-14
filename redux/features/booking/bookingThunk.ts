import { createAsyncThunk } from '@reduxjs/toolkit';
import AxiosInstance from '@/utils/services/helper/axiosInstance';

interface BookingPayload {
    user_id: number;
    service_id: number;
    staff_id: number | null;
    slots: number;
    appointment_date: string;
    time_slot_id: number;
    appointment_type: string;
    status: string;
    note: string;
}

export const getTimeSlots = createAsyncThunk(
    'booking/getTimeSlots',
    async (date: string, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().get(`time-slots/available?date=${date}`);
            return response.data.data;
        } catch (error: any) {
            console.log('Get time slots error:', error);
            return rejectWithValue(error.response?.data?.message || 'Không thể tải khung giờ');
        }
    }
);

export const createBooking = createAsyncThunk(
    'booking/createBooking',
    async (bookingData: BookingPayload, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().post('/appointments', bookingData);

            if (response?.data?.status === 422) {
                return rejectWithValue(response.data.message);
            }

            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                'Có lỗi xảy ra khi đặt lịch';

            console.log('Booking error:', {
                message: errorMessage,
                details: error.response?.data
            });

            return rejectWithValue(errorMessage);
        }
    }
); 