import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { getUserThunk } from "@/redux";

// Thunk để gửi mã xác thực số điện thoại
export const sendPhoneVerificationThunk = createAsyncThunk(
    "auth/sendPhoneVerification",
    async ({ lang }: { lang: string }, { rejectWithValue }: any) => {
        try {
            const res = await AxiosInstance().post("auth/phone/send-verification", {
                lang
            });

            if (res.data.success) {
                return {
                    verification_id: res.data.data.verification_id,
                    message: res.data.message
                };
            }

            return rejectWithValue(res.data.message || 'Gửi mã xác thực thất bại');
        } catch (error: any) {
            console.error('Send phone verification error:', error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message || "Gửi mã xác thực thất bại");
        }
    }
);

export const verifyPhoneThunk = createAsyncThunk(
    "auth/verifyPhone",
    async ({
        verificationId,
        code,
        lang
    }: {
        verificationId: string;
        code: string;
        lang: string;
    }, { rejectWithValue, dispatch }: any) => {
        try {
            const res = await AxiosInstance().post("auth/phone/verify", {
                verification_id: verificationId,
                code,
                lang
            });

            if (res.data.success) {
                // Cập nhật thông tin user sau khi xác thực thành công
                dispatch(getUserThunk());
                return res.data.data;
            }

            return rejectWithValue(res.data.message || 'Xác thực số điện thoại thất bại');
        } catch (error: any) {
            console.error('Verify phone error:', error.response?.data?.message);
            return rejectWithValue(error.response?.data?.message || "Xác thực số điện thoại thất bại");
        }
    }
); 