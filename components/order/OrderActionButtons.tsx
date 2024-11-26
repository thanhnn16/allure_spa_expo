import { View } from "react-native-ui-lib";
import { useDispatch } from "react-redux";
import { Orders } from "@/types/order.type";
import { useLanguage } from "@/hooks/useLanguage";

import AppButton from "../buttons/AppButton";
import { router } from "expo-router";
import { setOrderProducts } from "@/redux/features/order/orderSlice";

interface OrderActionButtonsProps {
  order: Orders;
  onCancel: () => void;
}

const OrderActionButtons = ({ order, onCancel }: OrderActionButtonsProps) => {
  const { t } = useLanguage();

  const dispatch = useDispatch();

  const handleReorder = () => {
    dispatch(
      setOrderProducts({
        items: order.order_items,
        totalAmount: order.total_amount,
        fromCart: false,
      })
    );

    router.push("/check-out");
  };

  return (
    <View bg-white paddingH-20 gap-10 marginB-20>
      {order.status === "pending" && (
        <AppButton
          type="outline"
          title={t("orders.cancel")}
          onPress={onCancel}
        />
      )}

      {(order.status === "completed" || order.status === "cancelled") && (
        <AppButton
          type="primary"
          title={t("orders.reorder")}
          onPress={handleReorder}
        />
      )}
    </View>
  );
};

export default OrderActionButtons;
