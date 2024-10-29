import React, { useEffect } from "react";
import { Stack, router, Redirect } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const AppLayout = () => {
  const { isAuthenticated, isGuest } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated && !isGuest) {
        router.replace("/(auth)");
      }
    };
    checkAuth();
  }, [isAuthenticated, isGuest]);

  if (!isAuthenticated && !isGuest) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="transaction/index" />
      <Stack.Screen name="product/[id]/index" />
      <Stack.Screen name="search/index" />
      <Stack.Screen name="favorite/index" />
      <Stack.Screen name="cart/index" />
      <Stack.Screen name="notification/index" />
      <Stack.Screen name="voucher/index" />
      <Stack.Screen name="payment/index" />
      <Stack.Screen name="reward/index" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="(chat)/ai-chat" />
      <Stack.Screen name="(chat)/[id]/index" />
      <Stack.Screen name="service/[id]/index"/>
    </Stack>
  );
};

export default AppLayout;
