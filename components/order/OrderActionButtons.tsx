import { View, Button, Colors } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { Orders } from "@/types/order.type";
import i18n from "@/languages/i18n";
import AppButton from "../buttons/AppButton";

const OrderActionButtons = ({ order }: { order: Orders }) => {
  const dispatch = useDispatch();

  const handleCancelOrder = () => {
    // Implement cancel order logic
  };

  const handleReorder = () => {
    // Implement reorder logic
  };

  if (order.status !== "pending") return null;

  return (
    <View bg-white row spread>
      <AppButton
        type="outline"
        title={i18n.t("orders.cancel")}
        onPress={handleCancelOrder}
      />
      <AppButton
        type="primary"
        title={i18n.t("orders.reorder")}
        onPress={handleReorder}
      />
    </View>
  );
};

export default OrderActionButtons;
