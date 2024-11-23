import { Pressable, StyleSheet } from "react-native";
import { Text, Image } from "react-native-ui-lib";
import { View } from "react-native-ui-lib";
import { BlurView } from "expo-blur";
import { Href, router } from "expo-router";
import BackIcon from "@/assets/icons/arrow_left.svg";
import ShoppingBagIcon from "@/assets/icons/shopping_bag.svg";
import { Ionicons } from "@expo/vector-icons";
import HomeHeaderButton from "@/components/buttons/HomeHeaderButton";

interface AppBarProps {
  back?: boolean;
  title: string;
  rightComponent?: React.ReactNode | boolean;
}

const AppBar = ({ title, rightComponent, back }: AppBarProps) => {
  return (
    <View paddingH-16 row centerV spread>
      {back ? (
        <Pressable onPress={router.back}>
          <View width={48} height={48} centerV>
            <Image source={BackIcon} />
          </View>
        </Pressable>
      ) : (
        <View width={48} height={48} />
      )}
      <Text h2_bold primary flex center>
        {title}
      </Text>
      {typeof rightComponent === 'boolean' ? (
        rightComponent ? (
          <Pressable onPress={() => router.push("/(app)/cart" as Href)}>
            <View width={48} height={48} centerV right>
              <HomeHeaderButton
                onPress={() => {
                  router.push("cart" as Href<string>);
                }}
                iconName="cart-outline"
                type="cart"
              />
            </View>
          </Pressable>
        ) : (
          <View width={48} height={48} />
        )
      ) : (
        rightComponent || <View width={48} height={48} />
      )}
    </View>
  );
};

export default AppBar;
