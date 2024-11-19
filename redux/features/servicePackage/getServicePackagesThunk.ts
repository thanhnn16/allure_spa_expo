import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";

export const getServicePackagesThunk = createAsyncThunk(
    "servicePackage/getServicePackages",
    async (userId: string, { rejectWithValue }: any) => {
        try {
            const response = await AxiosInstance().get(`/users/${userId}/service-packages`);

            // Transform và sắp xếp dữ liệu trước khi trả về
            const packages = response.data.map((pkg: any) => ({
                ...pkg,
                // Sắp xếp treatment_sessions theo thời gian mới nhất
                treatment_sessions: pkg.treatment_sessions?.sort((a: any, b: any) =>
                    new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
                ),
                // Thêm các trường tính toán nếu cần
                status_color: (() => {
                    switch (pkg.status) {
                        case 'active': return 'green';
                        case 'pending': return 'blue';
                        case 'expired': return 'red';
                        case 'completed': return 'purple';
                        default: return 'gray';
                    }
                })()
            }));

            // Sắp xếp packages theo trạng thái và thời gian
            return packages.sort((a: any, b: any) => {
                // Ưu tiên active và pending lên đầu
                const statusOrder: any = {
                    active: 0,
                    pending: 1,
                    completed: 2,
                    expired: 3
                };
                return (statusOrder[a.status] ?? 999) - (statusOrder[b.status] ?? 999);
            });

        } catch (error: any) {
            console.log("Error service package", error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message || 'Không thể tải dữ liệu gói dịch vụ');
        }
    }
); 