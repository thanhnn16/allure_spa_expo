import { Redirect } from 'expo-router';

// This file index.tsx is used to redirect the user to the /(tabs) route
export default function Index() {
  return <Redirect href="/(tabs)" />;
}
