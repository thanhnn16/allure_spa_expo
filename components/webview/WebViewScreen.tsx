import React from 'react';
import { WebView } from 'react-native-webview';
import { View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
import { router } from 'expo-router';
import axios from 'axios';

interface WebViewScreenProps {
  url: string;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ url }) => {
  const handleNavigationStateChange = (navState: any) => {
    // Kiểm tra URL có phải là callback URL không
    if (navState.url.startsWith('allurespa://')) {
      const params = new URL(navState.url).searchParams;
      const status = params.get('status');
      const orderCode = params.get('orderCode');

      // Xử lý callback
      if (status === 'success') {
        // Verify payment
        verifyPayment(orderCode);
      } else if (status === 'cancel') {
        // Xử lý hủy thanh toán
        router.back();
      }
    }
  };

  const verifyPayment = async (orderCode: string | null) => {
    if (!orderCode) return;

    try {
      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URL}/api/payos/verify`, {
        orderCode
      });

      if (response.data.success) {
        // Chuyển đến trang thành công
        router.push('/transaction/success');
      } else {
        // Xử lý lỗi
        router.push('/transaction?error=payment_failed');
      }
    } catch (error) {
      console.error('Verify payment error:', error);
      router.push('/transaction?error=verification_failed');
    }
  };

  return (
    <View style={styles.container}>
      <WebView 
        source={{ uri: url }} 
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
  webview: {
    flex: 1,
  },
});

export default WebViewScreen;
