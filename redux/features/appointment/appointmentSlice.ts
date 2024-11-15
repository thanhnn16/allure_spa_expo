import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { getAppointments } from '@/redux/features/appointment/appointmentThunk';

interface Appointment {
    id: number;
    title: string;
    start: string;
    end: string;
    service: {
        id: number;
        service_name: string;
        single_price: number;
    };
    status: string;
    time_slot: {
        start_time: string;
        end_time: string;
    };
    note: string | null;
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
        resetAppointmentState: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getAppointments.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
            state.loading = false;
            state.appointments = action.payload;
        });
        builder.addCase(getAppointments.rejected, (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        });
    }
});

export const { resetAppointmentState } = appointmentSlice.actions;
export default appointmentSlice.reducer;
