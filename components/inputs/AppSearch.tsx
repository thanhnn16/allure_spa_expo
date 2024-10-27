import { Colors, TextField, View, Image, Text } from "react-native-ui-lib";
import AntDesign from "@expo/vector-icons/AntDesign";
import { AppStyles } from "@/constants/AppStyles";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import SearchIcon from "@/assets/icons/search.svg";
import MicIcon from "@/assets/icons/mic.svg";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Href, router } from "expo-router";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { BlurView } from "expo-blur";

type AppSearchProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  isHome?: boolean;
  style?: StyleProp<ViewStyle>;
};

const AppSearch = ({ value, onChangeText, isHome, style }: AppSearchProps) => {
  return (
    <View
      width={"100%"}
      style={[
        style,
        {
          borderRadius: 8,
          borderColor: "#C9C9C9",
          borderWidth: 1,
          overflow: "hidden",
        },
      ]}
    >
      <BlurView
        intensity={190}
        style={{
          width: "100%",
          height: 55,
          paddingHorizontal: 10,
          alignSelf: "center",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Image source={SearchIcon} />
        {isHome ? (
          <Pressable
            style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            onPress={() => router.push("search" as Href<string>)}
          >
            <View flex marginL-10>
              <Text h3 gray>
                Tìm kiếm mỹ phẩm, liệu trình ...
              </Text>
            </View>
          </Pressable>
        ) : (
          <TextField
            value={value}
            onChangeText={onChangeText}
            placeholder="Tìm kiếm mỹ phẩm, liệu trình ..."
            placeholderTextColor={Colors.gray}
            containerStyle={{
              flex: 1,
              marginStart: 10,
            }}
          />
        )}
        <Image source={MicIcon} />
      </BlurView>
    </View>
  );
};

export default AppSearch;
