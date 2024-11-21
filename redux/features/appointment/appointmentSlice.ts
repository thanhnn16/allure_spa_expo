import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAppointments, cancelAppointment, updateAppointment } from '@/redux/features/appointment/appointmentThunk';

interface Service {
    id: number;
    service_name: string;
    single_price: number;
}

interface TimeSlot {
    start_time: string;
    end_time: string;
}

interface CancelledByUser {
    id: string;
    full_name: string;
}

interface Appointment {
    id: number;
    title: string;
    start: string;
    end: string;
    service: Service;
    status: string;
    time_slot: TimeSlot;
    note: string | null;
    cancelled_by: string | null;
    cancelled_at: string | null;
    cancellation_note: string | null;
    cancelled_by_user: CancelledByUser | null;
}

interface AppointmentState {
    appointments: Appointment[];
    loading: boolean;
    error: string | null;
}

const initialState: AppointmentState = {
    appointments: [],
    loading: false,
    error: null
};

export const appointmentSlice = createSlice({
    name: 'appointment',
    initialState,
    reducers: {
        resetAppointmentState: (state: AppointmentState) => {
            state.error = null;
            state.appointments = [];
            state.loading = false;
        }
    },
    extraReducers: (builder: any) => {
        builder.addCase(getAppointments.pending, (state: AppointmentState) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAppointments.fulfilled, (state: AppointmentState, action: any) => {
            state.loading = false;
            state.appointments = action.payload;
        });
        builder.addCase(getAppointments.rejected, (state: AppointmentState, action: any) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(cancelAppointment.pending, (state: AppointmentState) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(cancelAppointment.fulfilled, (state: AppointmentState, action: any) => {
            state.loading = false;
            state.appointments = state.appointments.map((appointment: Appointment) =>
                appointment.id === action.payload.id ? action.payload : appointment
            );
        });
        builder.addCase(cancelAppointment.rejected, (state: AppointmentState, action: any) => {
            state.loading = false;
            state.error = action.payload;
        });
        builder.addCase(updateAppointment.pending, (state: AppointmentState) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(updateAppointment.fulfilled, (state: AppointmentState, action: any) => {
            state.loading = false;
            state.appointments = state.appointments.map((appointment: Appointment) =>
                appointment.id === action.payload.id ? action.payload : appointment
            );
        });
        builder.addCase(updateAppointment.rejected, (state: AppointmentState, action: any) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { resetAppointmentState } = appointmentSlice.actions;
export default appointmentSlice.reducer;
