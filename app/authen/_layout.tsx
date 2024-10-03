import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack 
        initialRouteName="onboarding/index"
        screenOptions={{
            headerShown: false,
        }}>
             <Stack.Screen name="onboarding/index" />
            
        </Stack>

    );
}