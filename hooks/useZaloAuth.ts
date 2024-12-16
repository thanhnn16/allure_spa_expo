import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ZALO_CONSTANTS } from '@/utils/constants/zalo';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  handleZaloLogin,
} from '@/utils/services/zalo/zaloAuthService';
import * as Linking from 'expo-linking';

export const useZaloAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    try {
      setLoading(true);
      setError(null);

      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      const state = generateState();

      // Lưu các giá trị vào AsyncStorage
      await Promise.all([
        AsyncStorage.setItem(ZALO_CONSTANTS.STORAGE_KEYS.CODE_VERIFIER, codeVerifier),
        AsyncStorage.setItem(ZALO_CONSTANTS.STORAGE_KEYS.STATE, state)
      ]);

      try {
        await handleZaloLogin(codeChallenge, state, codeVerifier);
      } catch (error: any) {
        if (error.type === 'webview_required') {
          Linking.openURL(error.url);
          return;
        }
        throw error;
      }
    } catch (error: any) {
      setError(error.message || 'Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    loading,
    error
  };
};
