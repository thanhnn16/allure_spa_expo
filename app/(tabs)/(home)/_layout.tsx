import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen 
      name="details/[id]"
      options={{
        title: 'Chi tiết',
      }}
    />
    </Stack>
  );
}