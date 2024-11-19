import React from "react";
import {TouchableOpacity, View, Badge, Colors} from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";

type HomeHeaderButtonProps = {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  showBadge?: boolean;
  badgeCount?: number;
};

const HomeHeaderButton = ({
  onPress,
  iconName,
  showBadge,
  badgeCount,
}: HomeHeaderButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Ionicons name={iconName} size={24} color={Colors.primary} />
        {showBadge && (
          <Badge
            label={
              badgeCount && badgeCount > 99 ? "99+" : badgeCount?.toString()
            }
            size={16}
            backgroundColor={"$red30"}
            labelStyle={{ fontSize: 10, color: "white" }}
            containerStyle={{
              position: "absolute",
              top: -8,
              right: -8,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HomeHeaderButton;
