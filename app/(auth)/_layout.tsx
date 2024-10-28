import React, { useEffect } from "react";
import { Stack, router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const { isAuthenticated, isGuest } = useAuth();

  useEffect(() => {
    if (isAuthenticated || isGuest) {
      router.replace("/(app)/(tabs)/home");
    }
  }, [isAuthenticated, isGuest]);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="zalo-oauth" options={{ headerShown: false }} />
      <Stack.Screen name="change-password" options={{ headerShown: false }} />
      <Stack.Screen name="otp" options={{ headerShown: false }} />
    </Stack>
  );
}
