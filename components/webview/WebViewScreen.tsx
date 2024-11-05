import React, { useState } from "react";
import { WebView } from "react-native-webview";
import { View, StyleSheet } from "react-native";
import Constants from "expo-constants";
import { Href, router } from "expo-router";
import axios from "axios";
import { LoaderScreen } from "react-native-ui-lib";
import { WebViewType } from "@/utils/constants/webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppDialog from "@/components/dialog/AppDialog";

interface WebViewScreenProps {
  url: string;
  type: WebViewType;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ url, type }) => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    severity: "error" as "error" | "success" | "info" | "warning",
  });

  const showDialog = (
    title: string,
    description: string,
    severity: "error" | "success" | "info" | "warning"
  ) => {
    setDialogConfig({ title, description, severity });
    setDialogVisible(true);
  };

  const handleZaloCallback = (navState: any) => {
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

  const handlePaymentCallback = async (navState: any) => {
    if (
      navState.url.startsWith("allurespa://") ||
      navState.url.startsWith("exp+allurespa://")
    ) {
      const params = new URL(navState.url).searchParams;
      const status = params.get("status");

      if (status === "success") {
        try {
          const orderCode = await AsyncStorage.getItem("payos_order_code");
          if (!orderCode) {
            showDialog("Lỗi Xác Thực", "Không tìm thấy mã đơn hàng", "error");
            return;
          }

          const response = await axios.post(
            `${Constants.expoConfig?.extra?.EXPO_PUBLIC_SERVER_URL}/api/payos/verify`,
            { orderCode }
          );

          if (response.data.success) {
            await AsyncStorage.removeItem("payos_order_code");

            // Handle different payment types
            if (orderCode.startsWith("TEST_")) {
              router.push("/transaction/success");
            } else if (orderCode.startsWith("INV_")) {
              const [, invoiceId] = orderCode.split("_");
              router.push({
                pathname: "/(app)/invoice/success",
                params: {
                  invoice_id: invoiceId,
                  amount: response.data.data.amount,
                  payment_time: response.data.data.paymentTime,
                },
              });
            }
          } else {
            showDialog(
              "Thanh Toán Thất Bại",
              response.data.message || "Không thể xác nhận thanh toán",
              "error"
            );
            setTimeout(() => router.back(), 2000);
          }
        } catch (error) {
          console.error("Verify payment error:", error);
          showDialog("Lỗi Xác Thực", "Không thể xác thực thanh toán", "error");
          setTimeout(() => router.back(), 2000);
        }
      } else if (status === "cancel") {
        await AsyncStorage.removeItem("payos_order_code");
        showDialog(
          "Thanh Toán Đã Hủy",
          "Bạn đã hủy quá trình thanh toán",
          "info"
        );
        setTimeout(() => router.back(), 2000);
      }
    }
  };

  // Handle navigation state change
  const handleNavigationStateChange = (navState: any) => {
    switch (type) {
      case WebViewType.PAYMENT:
        handlePaymentCallback(navState);
        break;
      case WebViewType.ZALO_LOGIN:
        handleZaloCallback(navState);
        break;
      case WebViewType.GENERAL:
        // No special handling needed for general webview
        break;
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        style={styles.webview}
        onNavigationStateChange={handleNavigationStateChange}
        incognito={type === WebViewType.ZALO_LOGIN}
        javaScriptEnabled={true}
        renderLoading={() => <LoaderScreen />}
        pullToRefreshEnabled={true}
      />

      <AppDialog
        visible={dialogVisible}
        title={dialogConfig.title}
        description={dialogConfig.description}
        severity={dialogConfig.severity}
        onClose={() => setDialogVisible(false)}
        closeButton={true}
        confirmButton={false}
        closeButtonLabel="Đóng"
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
