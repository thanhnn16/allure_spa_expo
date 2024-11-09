import "@/constants/Colors";
import "@/constants/Typography";
import LanguageManager from "@/languages/LanguageManager";
import { store } from "@/redux";
import { persistor } from "@/redux/store";
import FirebaseService from "@/utils/services/firebase/firebaseService";
import "expo-dev-client";
import { useFonts } from "expo-font";
import { router, Slot, Stack } from "expo-router";
import { useEffect, useCallback } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { Button } from "react-native-ui-lib";

SplashScreen.preventAutoHideAsync();
interface ErrorFallbackProps {
  error: Error;
}

function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Something went wrong:</Text>
      <Text>{error.message}</Text>
      <Button label="Go back" onPress={() => router.back()} />
    </View>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "SFProText-Bold": require("@/assets/fonts/SFProText-Bold.otf"),
    "SFProText-Semibold": require("@/assets/fonts/SFProText-Semibold.otf"),
    "SFProText-Medium": require("@/assets/fonts/SFProText-Medium.otf"),
    "SFProText-Regular": require("@/assets/fonts/SFProText-Regular.otf"),
    "AlexBrush-Regular": require("@/assets/fonts/AlexBrush-Regular.ttf"),
    "KaiseiTokumin-Regular": require("@/assets/fonts/KaiseiTokumin-Regular.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        // Request permission and get initial token
        await FirebaseService.requestUserPermission();

        // Setup message handlers
        const unsubscribe = FirebaseService.setupMessageHandlers();

        return () => {
          unsubscribe();
        };
      } catch (error) {
        console.error("Failed to initialize Firebase:", error);
      }
    };

    initializeFirebase().then(() => console.log("Firebase initialized"));
  }, []);

  return (
      <Provider store={store}>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <LanguageManager>
              <Slot />
            </LanguageManager>
          </SafeAreaProvider>
        </PersistGate>
    </ErrorBoundary>
      </Provider>
  );
}
