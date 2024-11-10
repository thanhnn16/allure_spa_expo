import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { loginThunk } from '@/redux/features/auth/loginThunk';
import { registerThunk } from '@/redux/features/auth/registerThunk';
import { logoutThunk } from '@/redux/features/auth/logoutThunk';
import { setGuestUser, clearGuestUser } from '@/redux/features/auth/authSlice';
import { router } from 'expo-router';
import { LoginCredentials, RegisterCredentials, AuthErrorCode } from '@/types/auth.type';
import AuthService from '@/utils/services/auth/authService';
import { useZaloAuth } from './useZaloAuth';
import i18n from '@/languages/i18n';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const { login: zaloLogin } = useZaloAuth();

  const handleAuthError = (error: any) => {
    let errorMessage = i18n.t('auth.login.unknown_error');
    
    const errorCode = error?.code;
    const errorMsg = error?.message;

    if (errorCode) {
      switch (errorCode) {
        case AuthErrorCode.USER_NOT_FOUND:
        case AuthErrorCode.WRONG_PASSWORD:
          errorMessage = i18n.t('auth.login.invalid_credentials');
          break;
        case AuthErrorCode.INVALID_PHONE_FORMAT:
          errorMessage = i18n.t('auth.login.invalid_phone_number');
          break;
        case AuthErrorCode.INVALID_PASSWORD_FORMAT:
          errorMessage = i18n.t('auth.login.invalid_password_special_char');
          break;
        case AuthErrorCode.INVALID_EMAIL_FORMAT:
          errorMessage = i18n.t('auth.login.invalid_email');
          break;
        case AuthErrorCode.INVALID_NAME_FORMAT:
          errorMessage = i18n.t('auth.login.invalid_full_name');
          break;
        case AuthErrorCode.PASSWORDS_NOT_MATCH:
          errorMessage = i18n.t('auth.register.password_mismatch');
          break;
        case AuthErrorCode.SERVER_ERROR:
          errorMessage = i18n.t('auth.login.server_error');
          break;
        default:
          errorMessage = errorMsg || i18n.t('auth.login.unknown_error');
      }
    }
    
    return errorMessage;
  };

  const signIn = async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(loginThunk(credentials)).unwrap();
      if (result) {
        router.replace('/(app)/(tabs)/home');
        return result;
      }
    } catch (error: any) {
      const errorMessage = handleAuthError(error);
      throw new Error(errorMessage);
    }
  };

  const signUp = async (credentials: RegisterCredentials) => {
    try {
      const result = await dispatch(registerThunk(credentials)).unwrap();
      if (result) {
        router.replace('/(app)/(tabs)/home');
        return result;
      }
    } catch (error: any) {
      console.error('Sign up failed:', error);
      throw error;
    }
  };

  const signInWithZalo = async () => {
    try {
      await zaloLogin();
    } catch (error: any) {
      console.error('Sign in with Zalo failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await dispatch(logoutThunk()).unwrap();
      router.replace('/(auth)');
    } catch (error: any) {
      console.error('Sign out failed:', error);
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      await AuthService.loginAsGuest();
      dispatch(setGuestUser());
      router.replace('/(app)/(tabs)/home');
    } catch (error: any) {
      console.error('Sign in as guest failed:', error);
      throw error;
    }
  };

  const signOutGuest = () => {
    dispatch(clearGuestUser());
    router.replace('/(auth)');
  };

  return {
    ...authState,
    signIn,
    signUp,
    signOut,
    signInAsGuest,
    signOutGuest,
    signInWithZalo
  };
};
