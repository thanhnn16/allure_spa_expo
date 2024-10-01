import { Stack } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> 790351ce2567656ced9d31ac174c5ac90556f0de
  );
}