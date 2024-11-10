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
import { SafeAreaView } from "react-native-safe-area-context";
import AppBar from "../app-bar/AppBar";

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
      const orderCode = params.get("orderCode");
      const invoiceId = params.get("invoice_id");

      try {
        await AsyncStorage.removeItem("payos_order_code");
        await AsyncStorage.removeItem("current_invoice_id");
        const paymentData = await AsyncStorage.getItem("payment_data");
        await AsyncStorage.removeItem("payment_data");

        if (status === "success" && orderCode) {
          try {
            const response = await axios.post(
              `${Constants.expoConfig?.extra?.EXPO_PUBLIC_SERVER_URL}/api/payos/verify`,
              { orderCode }
            );

            if (response.data.success) {
              router.replace({
                pathname: "/transaction/success",
                params: {
                  invoice_id: invoiceId,
                  amount: response.data.data.amount,
                  payment_time: response.data.data.paymentTime,
                  payment_status: "completed",
                  payment_method: "payos",
                },
              });
            } else {
              throw new Error(
                response.data.message || "Không thể xác nhận thanh toán"
              );
            }
          } catch (error: any) {
            console.error("Payment verification error:", error);
            router.replace({
              pathname: "/(app)/invoice/failed",
              params: {
                type: "failed",
                reason: error.message || "Không thể xác thực thanh toán",
                invoice_id: invoiceId
              },
            });
          }
        } else if (status === "cancel") {
          let parsedPaymentData = null;
          if (paymentData) {
            try {
              parsedPaymentData = JSON.parse(paymentData);
            } catch (e) {
              console.error("Error parsing payment data:", e);
            }
          }

          router.replace({
            pathname: "/(app)/invoice/failed",
            params: {
              type: "cancel",
              invoice_id: invoiceId || parsedPaymentData?.invoice_id,
              reason: "Bạn đã hủy giao dịch thanh toán"
            },
          });
        }
      } catch (error) {
        console.error("Payment callback error:", error);
        router.replace({
          pathname: "/(app)/invoice/failed",
          params: {
            type: "failed",
            reason: "Đã xảy ra lỗi trong quá trình xử lý thanh toán",
            invoice_id: invoiceId
          },
        });
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <AppBar back title="" />
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
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
    </SafeAreaView>
  );
};

export default WebViewScreen;
