import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";

interface UpdateUserData {
  full_name: string;
  phone_number?: string;
  email?: string;
  gender?: string;
  date_of_birth?: Date | string;
}

export const updateUserThunk = createAsyncThunk(
  "user/updateUser",
  async (data: UpdateUserData, { rejectWithValue }: any) => {
    try {
      // Xử lý date_of_birth trước khi gửi request
      const formattedData = {
        ...data,
        // Chuyển đổi date_of_birth sang định dạng YYYY-MM-DD nếu có
        date_of_birth: data.date_of_birth
          ? new Date(data.date_of_birth).toISOString().split('T')[0]
          : undefined
      };

      const res: any = await AxiosInstance().patch<User>(`user/profile`, formattedData);

      if (res.data.success) {
        return res.data.data;
      }
      return rejectWithValue(res.data.message || 'Update user failed');
    } catch (error: any) {
      console.log('Update user error:', error.response?.data);
      return rejectWithValue(error.response?.data?.message || "Update user failed");
    }
  }
);
