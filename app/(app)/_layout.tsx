import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const AppLayout: React.FC = () => {
  const { isAuthenticated, isGuest } = useAuth();

  if (!isAuthenticated && !isGuest) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      {/* <Stack.Screen name="transaction/index" options={{ headerShown: false }} />
      <Stack.Screen name="product/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="search/index" options={{ headerShown: false }} />
      <Stack.Screen name="favorite/index" options={{ headerShown: false }} />
      <Stack.Screen name="cart/index" options={{ headerShown: false }} />
      <Stack.Screen name="notification/index" options={{ headerShown: false }} />
      <Stack.Screen name="voucher/index" options={{ headerShown: false }} />
      <Stack.Screen name="payment/index" options={{ headerShown: false }} />
      <Stack.Screen name="reward/index" options={{ headerShown: false }} /> */}
    </Stack>
  );
};

export default AppLayout;
