import { useEffect } from 'react';
import { View, Text } from 'react-native-ui-lib';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getAccessToken } from '@/utils/services/zalo/zaloAuthService';
import { useDispatch } from 'react-redux';
import { setZaloTokens, setZaloError } from '@/redux/zalo/ZaloSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OAuthCallback() {
  const { code } = useLocalSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleOAuthCallback = async () => {
      if (code) {
        try {
          const codeVerifier = await AsyncStorage.getItem('zalo_code_verifier');
          
          if (codeVerifier) {
            const accessTokenResponse = await getAccessToken(code as string, codeVerifier);
            if (accessTokenResponse) {
              dispatch(setZaloTokens(accessTokenResponse));
              router.replace('/(tabs)');
            }
          }
        } catch (error) {
          console.error('Error handling OAuth callback:', error);
          dispatch(setZaloError('Đăng nhập thất bại'));
          router.replace('/authen');
        }
      }
    };

    handleOAuthCallback();
  }, [code, router, dispatch]);

  return (
    <View flex center>
      <Text>Đang xử lý đăng nhập...</Text>
    </View>
  );
}
