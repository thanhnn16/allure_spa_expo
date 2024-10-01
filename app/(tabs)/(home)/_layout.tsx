import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen 
          name="details/[id]"
          options={{
            title: 'Chi tiết',
          }}
        />
        <Stack.Screen 
          name="favorite/index"
          options={{
            title: 'Yêu thích',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
}