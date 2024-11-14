import { createSlice } from '@reduxjs/toolkit';
import { getTimeSlots, createBooking } from '@/redux/features/booking/bookingThunk';

interface TimeSlot {
    id: number;
    start_time: string;
    end_time: string;
    max_bookings: number;
    available: boolean;
}

interface BookingState {
    timeSlots: TimeSlot[];
    loading: boolean;
    error: string | null;
    bookingSuccess: boolean;
}

const initialState: BookingState = {
    timeSlots: [],
    loading: false,
    error: null,
    bookingSuccess: false
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        resetBookingState: (state: BookingState) => {
            state.bookingSuccess = false;
            state.error = null;
        }
    },
    extraReducers: (builder: any) => {
        // Get Time Slots
        builder.addCase(getTimeSlots.pending, (state: BookingState) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getTimeSlots.fulfilled, (state: BookingState, action: any) => {
            state.loading = false;
            state.timeSlots = action.payload;
        });
        builder.addCase(getTimeSlots.rejected, (state: BookingState, action: any) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Create Booking
        builder.addCase(createBooking.pending, (state: BookingState) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(createBooking.fulfilled, (state: BookingState) => {
            state.loading = false;
            state.bookingSuccess = true;
        });
        builder.addCase(createBooking.rejected, (state: BookingState, action: any) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const { resetBookingState } = bookingSlice.actions;
export default bookingSlice.reducer; 