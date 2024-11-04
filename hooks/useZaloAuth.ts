import { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZALO_CONSTANTS } from '@/utils/constants/zalo';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  handleZaloLogin,
  ZaloAuthError,
  getAccessToken
} from '@/utils/services/zalo/zaloAuthService';
import { WebViewType } from '@/utils/constants/webview';
import { zaloLogin } from '@/redux/features/auth/authSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/store';

interface UseZaloAuthResult {
  login: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export const useZaloAuth = (): UseZaloAuthResult => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  const login = async () => {
    try {
      setLoading(true);
      setError(null);

      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateState();

      await Promise.all([
        AsyncStorage.setItem(ZALO_CONSTANTS.STORAGE_KEYS.CODE_VERIFIER, codeVerifier),
        AsyncStorage.setItem(ZALO_CONSTANTS.STORAGE_KEYS.STATE, state)
      ]);

      try {
        await handleZaloLogin(codeChallenge, state);
      } catch (error: any) {
        if (error.type === 'webview_required') {
          router.push({
            pathname: '/webview',
            params: {
              url: error.url,
              type: WebViewType.ZALO_LOGIN
            }
          });
        } else {
          throw error;
        }
      }

      const accessToken = await getAccessToken(codeVerifier, state);
      await dispatch(zaloLogin(accessToken)).unwrap();
      router.replace('/(app)');
    } catch (error) {
      if (error instanceof ZaloAuthError) {
        setError(error.message);
      } else {
        setError('Unexpected error during login');
        console.error('Zalo login error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
