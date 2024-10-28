import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { Linking } from 'react-native';
import { router } from 'expo-router';

interface ZaloLoginWebViewProps {
  url: string;
}

const ZaloLoginWebView: React.FC<ZaloLoginWebViewProps> = ({ url }) => {
  useEffect(() => {
    // Handle deep linking
    const handleDeepLink = (event: { url: string }) => {
      if (event.url.startsWith('allurespa://')) {
        const code = event.url.split('code=')[1]?.split('&')[0];
        if (code) {
          router.replace({
            pathname: '/(auth)/zalo-oauth',
            params: { code }
          });
        }
      }
    };

    // Add event listener for deep linking
    Linking.addEventListener('url', handleDeepLink);

    return () => {
      // Clean up
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
