import { Stack } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Redirect } from "expo-router";

export default function AuthLayout() {
  const { isAuthenticated, isGuest } = useSelector((state: RootState) => state.auth);

  // Redirect to app if authenticated or guest
  if (isAuthenticated || isGuest) {
    return <Redirect href="/(app)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}
