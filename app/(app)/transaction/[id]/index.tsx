import { View, Text, Colors } from "react-native-ui-lib";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { getOrderByIdThunk } from "@/redux/features/order/getOrderByIdThunk";
import AppBar from "@/components/app-bar/AppBar";
import { ScrollView, StyleSheet } from "react-native";
import OrderStatusBadge from "@/components/order/OrderStatusBadge";
import OrderItemCard from "@/components/order/OrderItemCard";
import OrderActionButtons from "@/components/order/OrderActionButtons";
import OrderSkeleton from "@/components/order/OrderSkeleton";
import i18n from "@/languages/i18n";
import formatCurrency from "@/utils/price/formatCurrency";
import { OrderItem } from "@/types/order.type";
import { useLocalSearchParams } from "expo-router";

const OrderDetail = () => {
  const { id } = useLocalSearchParams();
  const dispatch = useDispatch();
  const { selectedOrder, isLoading } = useSelector(
    (state: RootState) => state.order
  );

  useEffect(() => {
    dispatch(getOrderByIdThunk({ id: id }));
  }, [id]);

  if (isLoading || !selectedOrder) {
    return <OrderSkeleton />;
  }

  const subTotal = selectedOrder.order_items.reduce(
    (acc: any, item: any) => acc + item.price * item.quantity,
    0
  );

  return (
    <View flex bg-white>
      <AppBar back title={i18n.t("orders.detail")} />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

        {/* Order Status Section */}
        <View style={styles.section}>
          <View row spread centerV>
            <Text h2_bold>
              {i18n.t("orders.order_id")}: #{selectedOrder.id}
            </Text>
            <OrderStatusBadge status={selectedOrder.status} />
          </View>
          <Text h3 marginT-8 color={Colors.grey30}>
            {new Date(selectedOrder.created_at).toLocaleDateString()}
          </Text>
        </View>

        {/* Order Items Section */}
        <View style={styles.section}>
          <Text h2_bold marginB-16>
            {i18n.t("orders.items")}
          </Text>
          {selectedOrder.order_items?.map((item: OrderItem) => (
            <OrderItemCard key={item.id} item={item} />
          ))}
        </View>

        {/* Payment Info Section */}
        <View style={styles.section}>
          <Text h2_bold marginB-16>
            {i18n.t("orders.payment_info")}
          </Text>

          <View row spread marginB-8>
            <Text h3>{i18n.t("orders.subtotal")}</Text>
            <Text h3>
              {formatCurrency({
                price: Number(subTotal) || 0,
              })}
            </Text>
          </View>

          {Number(selectedOrder.discount_amount) > 0 && (
            <View row spread marginB-8>
              <Text h3>{i18n.t("orders.discount")}</Text>
              <Text h3 color={Colors.red30}>
                -
                {formatCurrency({
                  price: Number(selectedOrder.discount_amount) || 0,
                })}
              </Text>
            </View>
          )}

          <View row spread marginT-8>
            <Text h2>{i18n.t("orders.total")}</Text>
            <Text h2_bold color={Colors.secondary}>
              {formatCurrency({
                price:
                  Number(subTotal) -
                  (Number(selectedOrder.discount_amount) || 0),
              })}
            </Text>
          </View>
        </View>

        {/* Shipping Info Section */}
        {selectedOrder.shipping_address && (
          <View style={styles.section}>
            <Text text65L marginB-16>
              {i18n.t("orders.shipping_info")}
            </Text>
            <Text text80L marginB-8>
              {selectedOrder.shipping_address.full_name}
            </Text>
            <Text text80L marginB-8>
              {selectedOrder.shipping_address.phone}
            </Text>
            <Text text80L>
              {selectedOrder.shipping_address.address},{" "}
              {selectedOrder.shipping_address.ward},
              {selectedOrder.shipping_address.district},{" "}
              {selectedOrder.shipping_address.province}
            </Text>
          </View>
        )}

        {/* Note Section */}
        {selectedOrder.note && (
          <View style={styles.section}>
            <Text text65L marginB-8>
              {i18n.t("orders.note")}
            </Text>
            <Text text80L>{selectedOrder.note}</Text>
          </View>
        )}
      </ScrollView>

      {/* Action Buttons */}
      <OrderActionButtons order={selectedOrder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    padding: 16,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: Colors.grey40,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    borderColor: Colors.primary_light,
    borderWidth: 1,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default OrderDetail;
