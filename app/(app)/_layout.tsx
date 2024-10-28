import React, { useEffect } from "react";
import { Redirect, Stack, router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const AppLayout: React.FC = () => {
  const { isAuthenticated, isGuest } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !isGuest) {
      router.replace('/(auth)');
    }
  }, [isAuthenticated, isGuest]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
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
      <Stack.Screen
        name="(chat)/ai-voice"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
};

export default AppLayout;
