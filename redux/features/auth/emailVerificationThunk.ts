import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import { translate } from "@/languages/i18n";

interface SendVerificationRequest {
    lang: string;
}

interface VerifyEmailRequest {
    token: string;
    lang: string;
}

export const sendVerificationEmailThunk = createAsyncThunk(
    'auth/sendVerification',
    async (body: SendVerificationRequest, { rejectWithValue }: any) => {
        console.log('sendVerificationEmailThunk', body);
        try {
            const res = await AxiosInstance().post('/email/verify/send', {
                lang: body.lang
            });

            if (res.data.success) {
                return true;
            }

            return rejectWithValue({
                message: translate(`auth.errors.${res.data.message}`)
            });

        } catch (error: any) {
            return rejectWithValue({
                message: error?.response?.data?.message || translate('auth.errors.SERVER_ERROR')
            });
        }
    }
);

export const verifyEmailThunk = createAsyncThunk(
    'auth/verifyEmail',
    async (body: VerifyEmailRequest, { rejectWithValue }: any) => {
        try {
            const res = await AxiosInstance().post('/email/verify-email', {
                token: body.token,
                lang: body.lang
            });

            if (res.data.success) {
                return true;
            }

            return rejectWithValue({
                message: translate(`auth.errors.${res.data.message}`)
            });

        } catch (error: any) {
            return rejectWithValue({
                message: error?.response?.data?.message || translate('auth.errors.SERVER_ERROR')
            });
        }
    }
); 