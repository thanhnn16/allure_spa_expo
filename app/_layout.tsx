import "@/constants/Colors";
import "@/constants/Typography";
import LanguageManager from "@/languages/LanguageManager";
import { store } from "@/redux";
import { persistor } from "@/redux/store";
import FirebaseService from "@/utils/services/firebase/firebaseService";
import "expo-dev-client";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { useEffect, useCallback } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useSegments } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const segments = useSegments();

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
    const initializeApp = async () => {
      await FirebaseService.requestUserPermission();
      await FirebaseService.setupNotifications();
      FirebaseService.setupMessageHandlers();
    };

    initializeApp();
    onLayoutRootView();
  }, [onLayoutRootView]);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <PersistGate loading={null} persistor={persistor}>
          <LanguageManager>
            {segments[0] === "(auth)" ? (
              <Slot />
            ) : (
              <SafeAreaView
                edges={["top"]}
                style={{ flex: 1, backgroundColor: "white" }}
              >
                <StatusBar
                  backgroundColor="transparent"
                  barStyle={"dark-content"}
                />
                <Slot />
              </SafeAreaView>
            )}
          </LanguageManager>
        </PersistGate>
      </SafeAreaProvider>
    </Provider>
  );
}
