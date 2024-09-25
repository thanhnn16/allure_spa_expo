import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/app/helper/AxiosInstance";

export const loginThunk = createAsyncThunk(
    'user/login',
    async (body: any) => {
        try {
            const res: any = await AxiosInstance().post('auth/login', body);
            if (res.status === 200) {
                return res.data
            }
            return console.log(res.message);
        } catch (error: any) {
            console.log('Lỗi đăng nhập: ', error.message);
        }
    } 
)