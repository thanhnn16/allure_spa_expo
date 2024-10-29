import React from "react";
import { useLocalSearchParams } from "expo-router";
import WebViewScreen from "@/components/webview/WebViewScreen";
import { WebViewType } from "@/utils/constants/webview";

const WebViewRoute = () => {
  const { url, type } = useLocalSearchParams<{ 
    url: string;
    type: WebViewType;
  }>();

  if (!url || !type) {
    return null;
  }

  return <WebViewScreen url={url} type={type as WebViewType} />;
};

export default WebViewRoute;
