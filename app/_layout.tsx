import "@/constants/Colors";
import "@/constants/Typography";
import LanguageManager from "@/languages/LanguageManager";
import {store} from "@/redux";
import {persistor} from "@/redux/store";
import {useFonts} from "expo-font";
import {Slot, SplashScreen, Stack} from "expo-router";
import {useEffect} from "react";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {Provider} from "react-redux";
import {PersistGate} from "redux-persist/integration/react";
import FirebaseService from "@/utils/services/firebase/firebaseService";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "SFProText-Bold": require("@/assets/fonts/SFProText-Bold.otf"),
    "SFProText-Semibold": require("@/assets/fonts/SFProText-Semibold.otf"),
    "SFProText-Medium": require("@/assets/fonts/SFProText-Medium.otf"),
    "SFProText-Regular": require("@/assets/fonts/SFProText-Regular.otf"),
    "AlexBrush-Regular": require("@/assets/fonts/AlexBrush-Regular.ttf"),
    "KaiseiTokumin-Regular": require("@/assets/fonts/KaiseiTokumin-Regular.ttf"),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

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

  if (!fontsLoaded) {
    return null;
  }

  return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SafeAreaProvider>
            <LanguageManager>
              <Stack screenOptions={{headerShown: false}}>
                <Stack.Screen name="(auth)"/>
                <Stack.Screen name="(app)"/>
              </Stack>
            </LanguageManager>
          </SafeAreaProvider>
        </PersistGate>
      </Provider>
  );
}
