import { reduxStore } from "@/redux";
import { persistor } from "@/redux/ReduxStore";
import { Stack } from "expo-router";
import { View } from 'react-native-ui-lib';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import LanguageManager from "@/languages/LanguageManager";

export default function RootLayout() {
  return (
    <Provider store={reduxStore}>
      <PersistGate loading={null} persistor={persistor}>
        <LanguageManager>
          <View flex>
            <Stack initialRouteName="authen" screenOptions={{ headerShown: false }}>
              <Stack.Screen name="authen" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="notification/index" options={{ headerShown: false }} />
            </Stack>
          </View>
        </LanguageManager>
      </PersistGate>
    </Provider>
  );
}