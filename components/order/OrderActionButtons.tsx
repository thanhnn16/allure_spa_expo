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

  return (
    <View bg-white paddingH-20 gap-10 marginB-10>
      {order.status === "pending" && (
        <AppButton
          type="outline"
          title={i18n.t("orders.cancel")}
          onPress={handleCancelOrder}
        />
      )}

      {(order.status === "completed" || order.status === "cancelled") && (
        <AppButton
          type="primary"
          title={i18n.t("orders.reorder")}
          onPress={handleReorder}
        />
      )}
    </View>
  );
};

export default OrderActionButtons;
