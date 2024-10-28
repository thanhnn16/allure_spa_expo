import React, { useEffect } from "react";
import { Stack, router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const { isAuthenticated, isGuest } = useAuth();

  useEffect(() => {
    if (isAuthenticated || isGuest) {
      router.replace("/(app)");
    }
  }, [isAuthenticated, isGuest]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="zalo-oauth" />
      <Stack.Screen name="change-password" />
      <Stack.Screen name="otp" />
    </Stack>
  );
}
