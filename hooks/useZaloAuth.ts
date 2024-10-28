import { useState } from 'react';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  generateCodeVerifier,
  generateCodeChallenge,
  generateState,
  handleZaloLogin
} from '@/utils/services/zalo/zaloAuthService';

export const useZaloAuth = () => {
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      
      // Generate and save authentication data
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);
      const state = generateState();
      
      await AsyncStorage.setItem('zalo_code_verifier', codeVerifier);
      await AsyncStorage.setItem('zalo_state', state);

      await handleZaloLogin(codeChallenge, state);
    } catch (error: any) {
      if (error.type === 'webview_required') {
        router.push({
          pathname: '/webview',
          params: { url: error.url }
        });
      } else {
        console.error('Zalo login error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};
