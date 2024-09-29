import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack screenOptions={{
            headerShown: false,
        }}>
        <Stack.Screen name="authen/loginZalo" options={
            {
                headerShown: false,
            }
        } />

        <Stack.Screen name="authen/login" options={
            {
                headerShown: false,
            }
        } />

        <Stack.Screen name="authen/otp" options={
            {
                headerShown: false,
            }
        } />
        

        </Stack>
        
    );
}