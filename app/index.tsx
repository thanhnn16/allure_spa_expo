import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { Login } from "./authen/pages/Login";


export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <Login/>
    </View>
  );
}
