import { Pressable } from "react-native";
import { Text, Image } from "react-native-ui-lib";
import { View } from "react-native-ui-lib";
import { router } from "expo-router";
import BackIcon from "@/assets/icons/arrow_left.svg";

interface AppBarProps {
  back?: boolean;
  title: string;
  rightComponent?: React.ReactNode;
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
      <View width={48} height={48} centerV right>
        {rightComponent || <View />}
      </View>
    </View>
  );
};

export default AppBar;
