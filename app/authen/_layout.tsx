import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack
            initialRouteName="index"
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="form/LoginForm" />
            <Stack.Screen name="form/RegisterForm" />
            <Stack.Screen name="form/loginZaloForm" />
        </Stack>
    );
}