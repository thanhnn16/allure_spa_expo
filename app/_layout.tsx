import "@/constants/Colors";
import "@/constants/Typography";
import LanguageManager from "@/languages/LanguageManager";
import { store } from "@/redux";
import { persistor } from "@/redux/store";
import FirebaseService from "@/utils/services/firebase/firebaseService";
import "expo-dev-client";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();
interface ErrorFallbackProps {
  error: Error;
}

function ErrorFallback({ error }: ErrorFallbackProps) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Something went wrong:</Text>
      <Text>{error.message}</Text>
    </View>
  );
}

export default function RootLayout() {
  useFonts({
    "SFProText-Bold": require("@/assets/fonts/SFProText-Bold.otf"),
    "SFProText-Semibold": require("@/assets/fonts/SFProText-Semibold.otf"),
    "SFProText-Medium": require("@/assets/fonts/SFProText-Medium.otf"),
    "SFProText-Regular": require("@/assets/fonts/SFProText-Regular.otf"),
    "AlexBrush-Regular": require("@/assets/fonts/AlexBrush-Regular.ttf"),
    "KaiseiTokumin-Regular": require("@/assets/fonts/KaiseiTokumin-Regular.ttf"),
  });

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

  useEffect(() => {
    SplashScreen.hideAsync().catch((error) => {
      console.error("Failed to hide splash screen:", error);
    });
  }, []);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <LanguageManager>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)/" />
                <Stack.Screen name="(app)/" />
                <Stack.Screen name="error" />
                <Stack.Screen name="loading" />
              </Stack>
            </LanguageManager>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
    </ErrorBoundary>
  );
}
