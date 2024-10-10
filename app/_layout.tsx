import { Stack } from "expo-router";
import { View } from 'react-native-ui-lib';
export default function RootLayout() {
  return (
    <View flex>
      <Stack initialRouteName="authen" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="authen" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </View>
  );
}
