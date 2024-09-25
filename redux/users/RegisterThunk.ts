import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/app/helper/AxiosInstance";

export const registerThunk = createAsyncThunk(
    'user/register',
    async (body: any) => {
        try {
            const res: any = await AxiosInstance().post('auth/register', body);
            if (res.status === 200) {
                return res.data
            }
            return console.log(res.message);
        } catch (error: any) {
            console.log('Lỗi đăng ký: ', error.message);
        }
    } 
)