export interface BookingPayload {
    user_id?: string;
    staff_id?: string | null;
    service_id?: number;
    user_service_package_id?: number;
    slots: number;
    appointment_date: string;
    time_slot_id: number;
    appointment_type: 'service' | 'service_package' | 'consultation' | 'others';
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    note?: string;
}