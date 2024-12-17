import React, { useState } from "react";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import { LoaderScreen, View } from "react-native-ui-lib";
import { WebViewType } from "@/utils/constants/webview";
import AppDialog from "@/components/dialog/AppDialog";
import AppBar from "../app-bar/AppBar";
import { useLanguage } from "@/hooks/useLanguage";
import { WebViewNavigation } from "react-native-webview/lib/WebViewTypes";

interface WebViewScreenProps {
  url: string;
  type: WebViewType;
}

const WebViewScreen: React.FC<WebViewScreenProps> = ({ url, type }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    severity: "error" as "error" | "success" | "info" | "warning",
  });

  const handleZaloCallback = (navState: WebViewNavigation) => {
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

  const handlePaymentCallback = async (navState: WebViewNavigation) => {
    try {
      const currentUrl = navState.url;

      if (currentUrl.startsWith("allurespa://") || currentUrl.startsWith("exp+allurespa://")) {
        const urlPath = currentUrl.split("://")[1];
        const [screen] = urlPath.split("?");
        const params = new URLSearchParams(currentUrl.split("?")[1]);

        if (screen === "invoice/success" || screen === "invoice/failed") {
          const paramObject = Object.fromEntries(params);
          if (paramObject.order_id) {
            router.replace({
              pathname: screen === "invoice/success"
                ? "/(app)/invoice/success"
                : "/(app)/invoice/failed",
              params: paramObject
            });
          }
        }
      }
    } catch (error) {
      console.error("Payment callback error:", error);
    }
  };

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    try {
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
    } catch (error) {
      console.error("Navigation state change error:", error);
    }
  };

  return (
    <View flex bg-$white>
      <AppBar back title={t("common.back_to_home")} />
      <WebView
        source={{ uri: url }}
        style={{ flex: 1 }}
        onNavigationStateChange={handleNavigationStateChange}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        incognito={type === WebViewType.ZALO_LOGIN}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onError={(syntheticEvent) => {
          const { nativeEvent } = syntheticEvent;
          console.warn('WebView error: ', nativeEvent);
        }}
      />

      <AppDialog
        visible={dialogVisible}
        title={dialogConfig.title}
        description={dialogConfig.description}
        severity={dialogConfig.severity}
        onClose={() => setDialogVisible(false)}
        closeButton={true}
        confirmButton={false}
        closeButtonLabel={t("close")}
      />
    </View>
  );
};

export default WebViewScreen;
