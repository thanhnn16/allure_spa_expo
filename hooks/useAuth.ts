import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { 
  login, 
  register, 
  logout, 
  zaloLogin,
  setGuestUser, 
  clearGuestUser 
} from '@/redux/features/auth/authSlice';
import { router } from 'expo-router';
import { LoginCredentials, RegisterCredentials } from '@/types/auth.type';
import AuthService from '@/utils/services/auth/authService';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, isAuthenticated, isGuest, isLoading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const signIn = async (credentials: LoginCredentials) => {
    try {
      await dispatch(login(credentials)).unwrap();
      router.replace('/(app)');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const signUp = async (credentials: RegisterCredentials) => {
    try {
      await dispatch(register(credentials)).unwrap();
      router.replace('/(app)');
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await dispatch(logout()).unwrap();
      router.replace('/(auth)');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const signInWithZalo = async (accessToken: string) => {
    try {
      await dispatch(zaloLogin(accessToken)).unwrap();
      router.replace('/(app)');
    } catch (error) {
      console.error('Zalo login failed:', error);
      throw error;
    }
  };

  const signInAsGuest = async () => {
    try {
      await AuthService.loginAsGuest();
      dispatch(setGuestUser());
      router.replace('/(app)');
    } catch (error) {
      console.error('Guest login failed:', error);
      throw error;
    }
  };

  const signOutGuest = () => {
    dispatch(clearGuestUser());
    router.replace('/(auth)');
  };

  return {
    user,
    isAuthenticated,
    isGuest,
    isLoading,
    error,
    signIn,
    signUp,
    signOut,
    signInWithZalo,
    signInAsGuest,
    signOutGuest
  };
};
