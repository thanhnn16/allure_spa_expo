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

interface OrderProductItemProps {
  order: Orders;
  orderItem?: OrderItem;
}

const { width } = Dimensions.get("window");

const OrderProductItem = ({ order, orderItem }: OrderProductItemProps) => {
  const orderItems = order.order_items || [];

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
    const isService = item.service !== undefined;
    const itemData = isService ? item.service : item.product;

    return (
      <View key={item.id} paddingH-15 paddingB-10>
        <TouchableOpacity
          onPress={() => router.push(`/transaction/${order.id}`)}
          activeOpacity={0.7}
        >
          <View row spread marginT-10>
            {itemData?.media && itemData.media.length > 0 ? (
              <Animated.Image
                source={{ uri: itemData.media[0].full_url }}
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
                {isService ? itemData?.service_name : itemData?.name}
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
        <View row spread centerV paddingH-15 paddingT-15>
          <View row centerV>
            <Text h3_bold>#{order.id}</Text>
            <View
              marginL-10
              padding-5
              br20
              style={{
                backgroundColor:
                  order.status === "completed"
                    ? Colors.green30
                    : order.status === "cancelled"
                    ? Colors.red30
                    : Colors.orange30,
              }}
            >
              <Text white h4>
                {i18n.t(`orders.${order.status}`)}
              </Text>
            </View>
          </View>
          <View row gap-10 centerV>
            {(order.status === "completed" || order.status === "cancelled") && (
              <TouchableOpacity
                onPress={() => console.log("reorder")}
                style={{ padding: 5 }}
              >
                <Text h3 style={{ color: Colors.primary }}>
                  {i18n.t("orders.repurchase")}
                </Text>
              </TouchableOpacity>
            )}
            {order.status === "completed" ? (
              <TouchableOpacity
                onPress={() => router.push(`/transaction/${order.id}`)}
                style={{ padding: 5 }}
              >
                <Text h3_bold style={{ color: "#E4A951" }}>
                  {i18n.t("orders.rate_now")}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
        <View height={1} marginV-10 bg-$backgroundPrimaryLight></View>

        {orderItems.map(renderItem)}

        <View height={1} marginT-10 bg-$backgroundPrimaryLight></View>
        <View paddingH-15 paddingV-5 backgroundColor={Colors.primary_light}>
          <View row spread marginT-10>
            <Text h3_bold>{i18n.t("orders.total")}</Text>
            <Text h3_bold secondary>
              {formatCurrency({ price: Number(order.total_amount) })}
            </Text>
          </View>
        </View>
      </Animated.View>
    </View>
  );
};

export default OrderProductItem;
