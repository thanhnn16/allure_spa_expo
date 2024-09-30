import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack  screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="details/[id]"
        options={{
          title: 'Chi tiết',
        }}
      />
      <Stack.Screen 
        name="favorite/FavoritePage"
        options={{
          title: 'Yêu thích',
        }}
      />
    </Stack>
  );
}