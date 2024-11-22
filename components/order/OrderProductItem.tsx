import i18n from "@/languages/i18n";
import { OrderItem, Orders } from "@/types/order.type";
import formatCurrency from "@/utils/price/formatCurrency";
import { router } from "expo-router";
import { Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import {
  View,
  Text,
  TouchableOpacity,
  Colors,
  SkeletonView,
} from "react-native-ui-lib";
import OrderStatusBadge from "./OrderStatusBadge";
import AppButton from "../buttons/AppButton";
import LinearGradient from "react-native-linear-gradient";
import { useDispatch } from "react-redux";
import { setOrderProducts } from "@/redux/features/order/orderSlice";
import { ServiceResponeModel } from "@/types/service.type";
import { Product } from "@/types/product.type";

interface OrderProductItemProps {
  order: Orders;
  orderItem?: OrderItem;
}

const { width } = Dimensions.get("window");

const OrderProductItem = ({ order, orderItem }: OrderProductItemProps) => {
  const orderItems = order.order_items || [];
  const dispatch = useDispatch();

  const handleReorder = () => {
    dispatch(
      setOrderProducts({
        products: order.order_items,
        totalAmount: order.total_amount,
        fromCart: false,
      })
    );

    router.push("/check-out");
  };

  // Add loading skeleton
  if (!order || !orderItems.length) {
    return (
      <View
        style={{
          padding: 16,
          backgroundColor: "white",
          borderRadius: 10,
          margin: 10,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          elevation: 3,
        }}
      >
        <SkeletonView height={20} width={width * 0.3} />
        <View marginT-16>
          <SkeletonView height={100} width={width - 64} />
        </View>
        <View row spread marginT-16>
          <SkeletonView height={20} width={width * 0.4} />
          <SkeletonView height={20} width={width * 0.2} />
        </View>
      </View>
    );
  }

  const renderItem = (item: OrderItem) => {
    const isService = item.item_type === "service";
    const itemData = isService ? item.service : item.product;

    return (
      <View key={item.id} paddingH-15 paddingB-10>
        <TouchableOpacity
          onPress={() =>
            router.push(
              `${isService ? "/service" : "/product"}/${itemData?.id}`
            )
          }
          activeOpacity={0.7}
        >
          <View row spread marginT-10>
            {itemData?.media && itemData.media.length > 0 ? (
              <Animated.Image
                source={
                  itemData.media[0].full_url
                    ? { uri: itemData.media[0].full_url }
                    : require("@/assets/images/logo/logo.png")
                }
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 13,
                }}
                resizeMode="cover"
              />
            ) : (
              <SkeletonView width={100} height={100} borderRadius={13} />
            )}

            <View flex marginL-10 gap-5>
              <Text h3_bold numberOfLines={2}>
                {isService
                  ? (itemData as ServiceResponeModel)?.service_name
                  : (itemData as Product)?.name}
              </Text>
              <Text h3 color={Colors.grey30}>
                {i18n.t("orders.quantity")}: {item.quantity}
              </Text>
              <Text h3_bold primary>
                {formatCurrency({ price: Number(item.price) })}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 10,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 3,
      }}
    >
      <Animated.View>
        <LinearGradient
          colors={[
            Colors.white as string,
            Colors.rgba(Colors.primary, 0.05) as string,
          ]}
        >
          <TouchableOpacity
            onPress={() => router.push(`/order/${order.id}`)}
            activeOpacity={0.7}
          >
            <View row spread centerV paddingH-15 paddingT-15>
              <View row centerV>
                <Text h3_bold>#{order.id}</Text>
              </View>
              <View row gap-10 centerV>
                <OrderStatusBadge status={order.status} />
              </View>
            </View>
            <View height={1} marginV-10 bg-$backgroundPrimaryLight></View>

            {orderItems.map(renderItem)}

            <View height={1} marginT-10 bg-$backgroundPrimaryLight></View>

            <View paddingH-16 paddingV-8 gap-8>
              <View row spread marginT-10>
                <Text h3_bold>{i18n.t("orders.total")}</Text>
                <Text h3_bold secondary>
                  {formatCurrency({ price: Number(order.total_amount) })}
                </Text>
              </View>
              {(order.status === "completed" || order.status === "cancelled") &&
                order.order_items.some((item) => item.product) && (
                  <AppButton
                    type="outline"
                    title={i18n.t("orders.repurchase")}
                    onPress={() => handleReorder()}
                  />
                )}
              {order.status === "completed" ? (
                <AppButton
                  type="outline"
                  title={i18n.t("orders.rate_now")}
                  onPress={() => router.push(`/order/${order.id}`)}
                />
              ) : null}
            </View>
          </TouchableOpacity>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

export default OrderProductItem;
