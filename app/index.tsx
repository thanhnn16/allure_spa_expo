import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import ScreenNavigations from "../app/navigation/ScreenNavigations";


export default function Index() {
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <ScreenNavigations/>
    </View>
  );
}
