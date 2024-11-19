import {TouchableOpacity, View, Badge, Colors} from "react-native-ui-lib";
import { Ionicons } from "@expo/vector-icons";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

type HomeHeaderButtonProps = {
  onPress: () => void;
  iconName: keyof typeof Ionicons.glyphMap;
  type: "notification" | "cart";
};

const HomeHeaderButton = ({
  onPress,
  iconName,
  type,
}: HomeHeaderButtonProps) => {
  const unreadCount = useSelector(
    (state: RootState) => state.notification.unreadCount
  );
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const cartItemCount = cartItems.length;

  const getBadgeCount = () => {
    if (type === "notification") {
      return unreadCount;
    }
    return cartItemCount;
  };

  const count = getBadgeCount();

  return (
    <TouchableOpacity onPress={onPress}>
      <View>
        <Ionicons name={iconName} size={24} color={Colors.primary} />
        {count > 0 && (
          <Badge
            label={count > 99 ? "99+" : count.toString()}
            size={16}
            backgroundColor="#FF375B"
            labelStyle={{
              fontSize: 10,
              color: "white",
              fontWeight: "bold",
            }}
            containerStyle={{
              position: "absolute",
              top: -6,
              right: -6,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

export default HomeHeaderButton;
