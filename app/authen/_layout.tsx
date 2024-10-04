import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack
            initialRouteName="index"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="register/index" />
            <Stack.Screen name="login/index" />
            <Stack.Screen name="otp/index" />
        </Stack>
    );
}