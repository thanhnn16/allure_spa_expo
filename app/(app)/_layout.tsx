import React, { useEffect } from "react";
import { Stack, router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

const AppLayout = () => {
  const { initializing, user, error } = useAuth();

  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // Đợi cho đến khi auth được khởi tạo
        if (initializing) return;

        // Nếu không có user, chuyển đến màn hình đăng nhập
        if (!user) {
          await new Promise((resolve) => setTimeout(resolve, 500)); // Đợi animation
          router.replace("/(auth)");
        }
      } catch (err) {
        console.error("Navigation error:", err);
      }
    };

    checkAuthAndNavigate();
  }, [initializing, user]);

  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName={"(tabs)"}>
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
      <Stack.Screen name="chat/ai-chat" />
      <Stack.Screen name="chat/[id]/index" />
      <Stack.Screen name="service/[id]/index" />
      <Stack.Screen name="booking/[id]/index" />
    </Stack>
  );
};

export default AppLayout;
