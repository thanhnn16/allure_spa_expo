import { Stack } from "expo-router";
import { useFonts } from 'expo-font';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'SFProText-Regular': require('../assets/fonts/SFProText-Regular.otf'),
    'SFProText-Medium': require('../assets/fonts/SFProText-Medium.otf'),
    'SFProText-Bold': require('../assets/fonts/SFProText-Bold.otf'),
    'SFProText-Semibold': require('../assets/fonts/SFProText-Semibold.otf'),
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="index" />
    </Stack>
  );
}
