import { Pressable, StyleSheet } from "react-native";
import { Text, Image } from "react-native-ui-lib";
import { View } from "react-native-ui-lib";
import { BlurView } from "expo-blur";
import { Href, router } from "expo-router";
import BackIcon from "@/assets/icons/arrow_left.svg";
import ShoppingBagIcon from "@/assets/icons/shopping_bag.svg";

interface AppBarProps {
  back?: boolean;
  title: string;
  rightComponent?: boolean;
}

const AppBar = ({ title, rightComponent, back }: AppBarProps) => {
  return (
    <BlurView intensity={200}>
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
        {rightComponent ? (
            <Pressable onPress={() => router.push('/(app)/cart' as Href)}>
              <View width={48} height={48} centerV right>
                <Image source={ShoppingBagIcon} />
              </View>
            </Pressable>
        ) : (
          <View width={48} height={48} />
        )}
      </View>
    </BlurView>
  );
};

export default AppBar;
