import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack initialRouteName="authen" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="authen" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  );
}
