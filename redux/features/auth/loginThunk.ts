import { createAsyncThunk } from "@reduxjs/toolkit";
import AxiosInstance from "@/utils/services/helper/axiosInstance";
import FirebaseService from "@/utils/services/firebase/firebaseService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthResponse, AuthErrorCode } from "@/types/auth.type";
import i18n from "@/languages/i18n";
import { setUser } from "../users/userSlice";

interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export const loginThunk = createAsyncThunk(
  'user/login',
  async (body: LoginRequest, { dispatch, rejectWithValue }: { dispatch: any, rejectWithValue: (value: any) => any }) => {
    try {
      const res = await AxiosInstance().post<AuthResponse>('auth/login', {
        phone_number: body.phoneNumber,
        password: body.password
      });

      if (res.data.success && res.data.data) {
        const { token, user } = res.data.data;

        if (!token) {
          return rejectWithValue({
            code: 'NO_TOKEN',
            message: 'No token received from server'
          });
        }

        await AsyncStorage.setItem('userToken', token);
        dispatch(setUser(user));

        try {
          await FirebaseService.requestUserPermission();
          await FirebaseService.registerTokenWithServer();
        } catch (fcmError) {
          // Do nothing
        }

        return { token };
      }

      return rejectWithValue({
        code: res.data.status_code || 'UNKNOWN_ERROR',
        message: res.data.message || i18n.t('auth.login.unknown_error')
      });

    } catch (error: any) {
      if (error.response?.status === 422) {
        const validationErrors = error.response.data.errors;
        if (validationErrors.phone_number) {
          return rejectWithValue({
            code: AuthErrorCode.INVALID_PHONE_FORMAT,
            message: validationErrors.phone_number[0]
          });
        }
        if (validationErrors.password) {
          return rejectWithValue({
            code: AuthErrorCode.INVALID_PASSWORD_FORMAT,
            message: validationErrors.password[0]
          });
        }
      }

      if (error.response?.data?.status_code) {
        switch (error.response.data.status_code) {
          case AuthErrorCode.USER_NOT_FOUND:
          case AuthErrorCode.WRONG_PASSWORD:
            return rejectWithValue({
              code: error.response.data.status_code,
              message: i18n.t('auth.login.invalid_credentials')
            });
          default:
            return rejectWithValue({
              code: error.response.data.status_code,
              message: error.response.data.message || i18n.t('auth.login.unknown_error')
            });
        }
      }

      return rejectWithValue({
        code: AuthErrorCode.SERVER_ERROR,
        message: i18n.t('auth.login.server_error')
      });
    }
  }
);




