import { reduxStore } from "@/redux";
import { persistor } from "@/redux/ReduxStore";
import { Stack } from "expo-router";
import { View } from 'react-native-ui-lib';
import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react'
import LanguageManager from "@/languages/LanguageManager";
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import '@/constants/Colors';
import '@/constants/Typography';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SFProText-Bold': require('@/assets/fonts/SFProText-Bold.otf'),
    'SFProText-Semibold': require('@/assets/fonts/SFProText-Semibold.otf'),
    'SFProText-Medium': require('@/assets/fonts/SFProText-Medium.otf'),
    'SFProText-Regular': require('@/assets/fonts/SFProText-Regular.otf'),
    'AlexBrush-Regular': require('@/assets/fonts/AlexBrush-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

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
              <Stack.Screen name="oauth" options={{ headerShown: false }} />
            </Stack>
          </View>
        </LanguageManager>
      </PersistGate>
    </Provider>
  );
}
