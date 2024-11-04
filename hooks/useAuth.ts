import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { loginThunk } from '@/redux/features/auth/loginThunk';
import { registerThunk } from '@/redux/features/auth/registerThunk';
import { logoutThunk } from '@/redux/features/auth/logoutThunk';
import { setGuestUser, clearGuestUser } from '@/redux/features/auth/authSlice';
import { router } from 'expo-router';
import { LoginCredentials, RegisterCredentials } from '@/types/auth.type';
import AuthService from '@/utils/services/auth/authService';
import { useZaloAuth } from './useZaloAuth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);
  const { login: zaloLogin } = useZaloAuth();


  const signIn = async (credentials: LoginCredentials) => {
    try {
      const result = await dispatch(loginThunk(credentials)).unwrap();
      if (result) {
        await new Promise(resolve => setTimeout(resolve, 100));
        router.replace('/(app)/(tabs)/home');
        return result;
      }
    } catch (error: any) {
      console.error('Sign in failed:', error);
      throw error;
    }
  };

  const signUp = async (credentials: RegisterCredentials) => {
    try {
      const result = await dispatch(registerThunk(credentials)).unwrap();
      if (result) {
        await new Promise(resolve => setTimeout(resolve, 100));
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
      await new Promise(resolve => setTimeout(resolve, 100));
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
      await new Promise(resolve => setTimeout(resolve, 100));
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
