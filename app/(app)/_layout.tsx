import { Stack } from "expo-router";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserThunk } from "@/redux/features/users/getUserThunk";
import { RootState } from "@/redux/store";
import { Redirect } from "expo-router";

export default function AppLayout() {
  const dispatch = useDispatch();
  const { isAuthenticated, isGuest } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(getUserThunk());
  }, [dispatch]);

  // Redirect to auth if not authenticated and not guest
  if (!isAuthenticated && !isGuest) {
    return <Redirect href="/(auth)" />;
  }

  return <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)" />;
}
