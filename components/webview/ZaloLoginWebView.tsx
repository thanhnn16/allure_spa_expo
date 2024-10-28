import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { Linking } from 'react-native';
import { router } from 'expo-router';

interface ZaloLoginWebViewProps {
  url: string;
}

const ZaloLoginWebView: React.FC<ZaloLoginWebViewProps> = ({ url }) => {
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      if (event.url.startsWith('allurespa://oauth')) {
        const urlObj = new URL(event.url);
        const code = urlObj.searchParams.get('code');
        const state = urlObj.searchParams.get('state');
        
        if (code) {
          router.replace({
            pathname: '/(auth)/zalo-oauth',
            params: { code, state }
          });
        }
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);

  return (
    <WebView 
      source={{ uri: url }}
      incognito={true}
      javaScriptEnabled={true}
    />
  );
};

export default ZaloLoginWebView;
