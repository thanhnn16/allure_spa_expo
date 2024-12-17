import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { User } from "@/types/user.type";

export const deleteUserThunk = createAsyncThunk(
  "user/deleteUser",
  async (id: any, { rejectWithValue }: any) => {
    try {
      console.log("delete hehe");
      const res: any = await AxiosInstance().delete(`users/${id}`);
      console.log(res.data);
      console.log("delete hehe");
      if (res.data.success) {
        return res.data.message;
      }
      return rejectWithValue(res.data.message || "Delete user failed");
    } catch (error: any) {
      console.log(error.response?.data?.message || "Delete user failed");
      return rejectWithValue(
        error.response?.data?.message || "Delete user failed"
      );
    }
  }
);
