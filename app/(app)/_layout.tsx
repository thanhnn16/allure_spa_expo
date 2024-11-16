import React, { useEffect } from "react";
import { Stack, router } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

const AppLayout = () => {
  const { isAuthenticated, isGuest } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isAuthenticated && !isGuest) {
        router.replace("/(auth)");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isAuthenticated, isGuest]);

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName={"(tabs)"}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="transaction/[id]/index" />
      <Stack.Screen name="product/[id]/index" />
      <Stack.Screen name="search/index" />
      <Stack.Screen name="favorite/index" />
      <Stack.Screen name="cart/index" />
      <Stack.Screen name="notification/index" />
      <Stack.Screen name="voucher/index" />
      <Stack.Screen name="check-out/index" />
      <Stack.Screen name="reward/index" />
      <Stack.Screen name="settings/index" />
      <Stack.Screen name="chat/ai-chat" />
      <Stack.Screen name="chat/[id]/index" />
      <Stack.Screen name="service/[id]/index" />
      <Stack.Screen name="booking/index" />
      <Stack.Screen name="order/index" />
      <Stack.Screen name="invoice/failed" />
      <Stack.Screen name="invoice/success" />
      <Stack.Screen name="address/update" />
      <Stack.Screen name="address/add" />
      <Stack.Screen name="address/index" />
      <Stack.Screen name="see-more/index" />
      <Stack.Screen name="profile/about-app" />
      <Stack.Screen name="profile/detail" />
      <Stack.Screen name="profile/edit" />
      <Stack.Screen name="profile/delete-account" />
      <Stack.Screen name="profile/delete-account-verify" />
    </Stack>
  );
};

export default AppLayout;
