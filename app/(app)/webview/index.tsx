import React from "react";
import { useLocalSearchParams } from "expo-router";
import WebViewScreen from "@/components/webview/WebViewScreen";
import { WebViewType } from "@/utils/constants/webview";

const WebViewRoute = () => {
  const { url, type } = useLocalSearchParams<{
    url: string;
    type: WebViewType;
  }>();

  if (!url) {
    return null;
  }

  let webViewType = WebViewType.GENERAL;
  if (type && Object.values(WebViewType).includes(type as WebViewType)) {
    webViewType = type as WebViewType;
  }

  return <WebViewScreen url={url} type={webViewType} />;
};

export default WebViewRoute;
