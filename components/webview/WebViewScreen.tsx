import React, { useState } from "react";
import { WebView } from "react-native-webview";
import { router } from "expo-router";
import { LoaderScreen, View } from "react-native-ui-lib";
import { WebViewType } from "@/utils/constants/webview";
import AppDialog from "@/components/dialog/AppDialog";
import AppBar from "../app-bar/AppBar";
import i18n from "@/languages/i18n";
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
    const url = navState.url;
    if (url.startsWith("allurespa://") || url.startsWith("exp+allurespa://")) {
      const urlPath = url.split("://")[1]; // Get path after scheme
      const [screen] = urlPath.split("?"); // Get screen name
      const params = new URL(navState.url).searchParams;

      if (screen === "invoice/success") {
        router.replace({
          pathname: "/(app)/invoice/success",
          params: Object.fromEntries(params),
        });
      } else if (screen === "invoice/failed") {
        router.replace({
          pathname: "/(app)/invoice/failed",
          params: Object.fromEntries(params),
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
    <View flex bg-$white>
      <AppBar back title={i18n.t("common.back_to_home")} />
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
        closeButtonLabel={i18n.t("close")}
      />
    </View>
  );
};

export default WebViewScreen;
