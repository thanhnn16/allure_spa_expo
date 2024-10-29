import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setUser, clearUser, setGuestUser, clearGuestUser } from '@/redux/features/auth/authSlice';
import { router } from 'expo-router';

export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const user = useSelector((state: RootState) => state.auth.user);

  const signIn = (userData: any) => {
    dispatch(setUser(userData));
  };

  const signOut = () => {
    dispatch(clearUser());
    router.replace('/(auth)');
  };

  const signInAsGuest = () => {
    dispatch(setGuestUser());
  };

  const signOutGuest = () => {
    dispatch(clearGuestUser());
    router.replace('/(auth)');
  };

  return { isAuthenticated, user, signIn, signOut, signInAsGuest, signOutGuest, isGuest: useSelector((state: RootState) => state.auth.isGuest) };
};
