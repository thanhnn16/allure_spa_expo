import React from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { router } from "expo-router";
import axios from "axios";
import * as Linking from "expo-linking";
import { LoaderScreen } from "react-native-ui-lib";
import { WebViewType } from "@/utils/constants/webview";

interface WebViewScreenProps {
  url: string;
  type: WebViewType;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ url, type }) => {
  // Handle Zalo login callback
  const handleZaloCallback = (navState: any) => {
    // Kiểm tra URL có chứa code và state không
    const urlObj = new URL(navState.url);
    const code = urlObj.searchParams.get("code");
    const state = urlObj.searchParams.get("state");

    if (code && state) {
      router.replace({
        pathname: "/(auth)/zalo-oauth",
        params: { code, state },
      });
    }
  };

  // Handle payment callback
  const handlePaymentCallback = async (navState: any) => {
    if (navState.url.startsWith("allurespa://")) {
      const params = new URL(navState.url).searchParams;
      const status = params.get("status");
      const orderCode = params.get("orderCode");

      if (status === "success" && orderCode) {
        try {
          const response = await axios.post(
            `${process.env.EXPO_PUBLIC_SERVER_URL}/api/payos/verify`,
            { orderCode }
          );

          if (response.data.success) {
            router.push("/transaction/success");
          } else {
            router.push("/transaction?error=payment_failed");
          }
        } catch (error) {
          console.error("Verify payment error:", error);
          router.push("/transaction?error=verification_failed");
        }
      } else if (status === "cancel") {
        router.back();
      }
    }
  };

  // Handle navigation state change
  const handleNavigationStateChange = (navState: any) => {
    // Handle payment callback
    if (type === WebViewType.PAYMENT) {
      handlePaymentCallback(navState);
    }
    // Handle Zalo login progress page - sửa điều kiện kiểm tra
    else if (type === WebViewType.ZALO_LOGIN) {
      handleZaloCallback(navState);
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        incognito={true}
        javaScriptEnabled={true}
        renderLoading={() => <LoaderScreen />}
        pullToRefreshEnabled={true}
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
