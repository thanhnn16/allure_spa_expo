import { useSelector } from "react-redux";
import { Redirect, Stack } from "expo-router";
import { RootState } from "@/redux/store";
import { useAuth } from "@/hooks/useAuth";

export default function AuthLayout() {
  const { isAuthenticated, isGuest } = useAuth();

  if (isAuthenticated || isGuest) {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
