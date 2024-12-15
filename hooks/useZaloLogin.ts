// hooks/useZaloLogin.ts
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/features/users/userSlice';
import { setZaloTokens } from '@/redux/features/auth/authSlice';
import { useState } from 'react';
import AxiosInstance from '@/utils/services/helper/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZALO_CONSTANTS } from '@/utils/constants/zalo';
import { router } from 'expo-router';

export const useZaloLogin = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleZaloOAuthSuccess = async (zaloTokens: {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    refresh_token_expires_in: number;
  }) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await AxiosInstance().post('/auth/zalo/callback', {
        access_token: zaloTokens.access_token,
        refresh_token: zaloTokens.refresh_token,
        expires_in: zaloTokens.expires_in.toString(),
        refresh_token_expires_in: zaloTokens.refresh_token_expires_in.toString()
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      dispatch(setUser(response.data.user));
      dispatch(setZaloTokens(zaloTokens));

      await AsyncStorage.multiRemove([
        ZALO_CONSTANTS.STORAGE_KEYS.CODE_VERIFIER,
        ZALO_CONSTANTS.STORAGE_KEYS.STATE
      ]);

      router.replace('/(app)/(tabs)/home');
      return response.data;
    } catch (error: any) {
      console.error("Error handling OAuth callback:", error.response?.data || error.message);
      setError(error.response?.data?.message || 'Đăng nhập thất bại');
      router.replace('/(auth)');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleZaloOAuthError = (error: string) => {
    setError(error);
    router.replace('/(auth)');
  };

  return {
    handleZaloOAuthSuccess,
    handleZaloOAuthError,
    isLoading,
    error
  };
};