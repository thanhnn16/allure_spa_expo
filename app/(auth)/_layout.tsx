import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Stack } from "expo-router/stack";
import { useAuth } from "../../hooks/useAuth";

export default function AuthLayout() {
  const router = useRouter();
  const { initializing, user, error } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!initializing && user) {
        router.replace("/(app)");
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [initializing, user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
