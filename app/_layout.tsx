import { reduxStore } from "@/redux";
import { Stack } from "expo-router";
import { View } from 'react-native-ui-lib';
import { Provider } from "react-redux";

export default function RootLayout() {
  return (
    <Provider store={reduxStore}>
      <View flex>
        <Stack initialRouteName="authen" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="authen" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="notification/index" options={{ headerShown: false }} />
        </Stack>
      </View>
    </Provider>

  );
}
