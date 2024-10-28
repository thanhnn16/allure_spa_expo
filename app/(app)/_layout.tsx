import React from "react";
import { Redirect, Stack } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const AppLayout: React.FC = () => {
  const { isAuthenticated, isGuest } = useAuth();

  if (!isAuthenticated && !isGuest) {
    return <Redirect href="/(auth)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)"/>
      <Stack.Screen name="transaction/index"/>
      <Stack.Screen name="product/[id]/index"/>
      <Stack.Screen name="search/index"/>
      <Stack.Screen name="favorite/index"/>
      <Stack.Screen name="cart/index"/>
      <Stack.Screen name="notification/index"/>
      <Stack.Screen name="voucher/index"/>
      <Stack.Screen name="payment/index"/>
      <Stack.Screen name="reward/index"/>
      <Stack.Screen name="service/[id]/index"/>
    </Stack>
  );
};

export default AppLayout;
