import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";

export const getServicePackagesThunk = createAsyncThunk(
    "servicePackage/getServicePackages",
    async (userId: string, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().get(`/users/${userId}/service-packages`);

            const packages = response.data.data.map((pkg: any) => {
                const nextAppointment = pkg.treatment_sessions?.find((session: any) =>
                    new Date(session.start) > new Date() && session.status === 'confirmed'
                );

                return {
                    ...pkg,
                    treatment_sessions: pkg.treatment_sessions?.sort((a: any, b: any) =>
                        new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
                    ),
                    next_appointment_details: pkg.next_appointment_details ? {
                        date: pkg.next_appointment_details.date,
                        time: {
                            start: pkg.next_appointment_details.time.start,
                            end: pkg.next_appointment_details.time.end
                        },
                        staff: pkg.next_appointment_details.staff
                    } : null,
                    status_color: (() => {
                        switch (pkg.status) {
                            case 'active': return 'green';
                            case 'pending': return 'blue';
                            case 'expired': return 'red';
                            case 'completed': return 'purple';
                            default: return 'gray';
                        }
                    })()
                };
            });

            return packages.sort((a: any, b: any) => {
                const statusOrder: any = {
                    active: 0,
                    pending: 1,
                    completed: 2,
                    expired: 3
                };
                return (statusOrder[a.status] ?? 999) - (statusOrder[b.status] ?? 999);
            });

        } catch (error: any) {
            console.log("Error service package", error.response);
            return rejectWithValue(error.response?.data?.message || 'Không thể tải dữ liệu gói dịch vụ');
        }
    }
); 