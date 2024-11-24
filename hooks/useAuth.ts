import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { loginThunk } from '@/redux/features/auth/loginThunk';
import { registerThunk } from '@/redux/features/auth/registerThunk';
import { logoutThunk } from '@/redux/features/auth/logoutThunk';
import { setGuestUser, clearGuestUser, clearAuth } from '@/redux/features/auth/authSlice';
import { router } from 'expo-router';
import { LoginCredentials, RegisterCredentials, AuthErrorCode } from '@/types/auth.type';
import AuthService from '@/utils/services/auth/authService';
import { translate } from '@/languages/i18n';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const { user } = useSelector((state: RootState) => state.user);

  const handleAuthError = (error: any) => {
    let errorMessage = translate('auth.login.unknown_error');
    const errorCode = error?.code;
    const errorMsg = error?.message;

    if (!errorCode) return errorMsg || errorMessage;

    switch (errorCode) {
      case AuthErrorCode.USER_NOT_FOUND:
      case AuthErrorCode.WRONG_PASSWORD:
        return translate('auth.login.invalid_credentials');
      case AuthErrorCode.INVALID_PHONE_FORMAT:
        return translate('auth.login.invalid_phone_number');
      case AuthErrorCode.INVALID_PASSWORD_FORMAT:
        return translate('auth.login.invalid_password_special_char');
      case AuthErrorCode.INVALID_EMAIL_FORMAT:
        return translate('auth.login.invalid_email');
      case AuthErrorCode.INVALID_NAME_FORMAT:
        return translate('auth.login.invalid_full_name');
      case AuthErrorCode.PASSWORDS_NOT_MATCH:
        return translate('auth.register.password_mismatch');
      case AuthErrorCode.SERVER_ERROR:
        return translate('auth.login.server_error');
      default:
        return errorMsg || errorMessage;
    }
  };

  const signIn = async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(loginThunk(credentials)).unwrap();
      return result;
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (credentials: RegisterCredentials) => {
    try {
      const result = await dispatch(registerThunk(credentials)).unwrap();
      return result;
    } catch (error: any) {
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      dispatch(clearAuth());
      dispatch(clearGuestUser());
    } catch (error: any) {
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      await AuthService.loginAsGuest();
      dispatch(setGuestUser());
    } catch (error: any) {
      throw error;
    }
  };

  return {
    ...authState,
    user,
    signIn,
    signUp,
    signOut,
    signInAsGuest,
  };
};
