import {
  Colors,
  TextField,
  View,
  Image,
  Text,
  TouchableOpacity,
} from "react-native-ui-lib";
import AntDesign from "@expo/vector-icons/AntDesign";

import SearchIcon from "@/assets/icons/search.svg";
import MicIcon from "@/assets/icons/mic.svg";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Href, router } from "expo-router";
import { BlurView } from "expo-blur";
import i18n from "@/languages/i18n";

type AppSearchProps = {
  value?: string;
  onChangeText?: (text: string) => void;
  onClear?: () => void;
  isHome?: boolean;
  style?: StyleProp<ViewStyle>;
};

const AppSearch = ({
  value,
  onChangeText,
  onClear,
  isHome,
  style,
}: AppSearchProps) => {
  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChangeText) {
      onChangeText("");
    }
  };

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
      <View
        style={{
          width: "100%",
          height: 48,
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
                {i18n.t("home.placeholder_search")}
              </Text>
            </View>
          </Pressable>
        ) : (
          <View flex row centerV>
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
            {value && value.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={{ padding: 5 }}>
                <AntDesign name="close" size={20} color={Colors.gray} />
              </TouchableOpacity>
            )}
          </View>
        )}
        <Image source={MicIcon} />
      </View>
    </View>
  );
};

export default AppSearch;
