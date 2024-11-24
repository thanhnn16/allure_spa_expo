import "@/constants/Colors";
import "@/constants/Typography";
import { store } from "@/redux";
import { persistor } from "@/redux/store";
import FirebaseService from "@/utils/services/firebase/firebaseService";
import "expo-dev-client";
import { useFonts } from "expo-font";
import { Slot, useSegments, useRouter } from "expo-router";
import { useEffect, useCallback } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

SplashScreen.preventAutoHideAsync();

// Separate component for auth-aware navigation
function AuthAwareNavigator() {
  const segments = useSegments();
  const { isAuthenticated, isGuest } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";
    const inAppGroup = segments[0] === "(app)";

    if (!router) return;

    if (isAuthenticated || isGuest) {
      if (inAuthGroup) {
        router.replace("/(app)");
      }
    } else {
      if (inAppGroup) {
        router.replace("/(auth)");
      }
    }
  }, [segments, isAuthenticated, isGuest, router]);

  if (segments[0] === "(auth)") {
    return <Slot />;
  }

  return (
    <SafeAreaView edges={["top"]} style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar backgroundColor="transparent" barStyle="dark-content" />
      <Slot />
    </SafeAreaView>
  );
}

// Separate component for initialization
function InitializedApp() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <AuthAwareNavigator />
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
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

  const initializeFirebase = useCallback(async () => {
    await FirebaseService.requestUserPermission();
    await FirebaseService.setupNotifications();
    FirebaseService.setupMessageHandlers();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      initializeFirebase();
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, initializeFirebase]);

  if (!fontsLoaded) {
    return null;
  }

  return <InitializedApp />;
}
