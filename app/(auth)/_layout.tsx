import { useEffect } from "react";
import { useRouter } from "expo-router";
import { Stack } from "expo-router/stack";
import { useAuth } from "../../hooks/useAuth";

export default function AuthLayout() {
  const router = useRouter();
  const { initializing, user, error } = useAuth();

  useEffect(() => {
    const checkAuthAndNavigate = () => {
      try {
        if (initializing) return;
        if (user) {
          router.replace("/(app)");
        }
      } catch (err) {
        console.error("Navigation error:", err);
      }
    };

    checkAuthAndNavigate();
  }, [initializing, user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
