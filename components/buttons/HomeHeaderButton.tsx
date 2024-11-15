import React from "react";
import { SvgProps } from "react-native-svg";
import { TouchableOpacity, View } from "react-native-ui-lib";
import { Badge } from "react-native-ui-lib";

type ButtonMessageIconProps = {
  onPress: () => void;
  source: React.FC<SvgProps>;
  showBadge?: boolean;
  badgeCount?: number;
};
const ButtonMessageIcon = ({
  onPress,
  source,
  showBadge,
  badgeCount,
}: ButtonMessageIconProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <source width={24} height={24} />
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

export default ButtonMessageIcon;
