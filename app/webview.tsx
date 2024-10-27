import React from "react";
import { useLocalSearchParams } from "expo-router";
import WebViewScreen from "@/components/webview/WebViewScreen";

const WebViewRoute = () => {
  const { url } = useLocalSearchParams<{ url: string }>();

  if (!url) {
    return null; // or some error component
  }

  return <WebViewScreen url={url} />;
};

export default WebViewRoute;
