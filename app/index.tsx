import { Redirect } from "expo-router";

export default function App() {
  console.log("App");
  return <Redirect href="/(auth)" />;
}
