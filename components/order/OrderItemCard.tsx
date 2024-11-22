import { View, Text, Image, Colors, TouchableOpacity } from "react-native-ui-lib";
import { OrderItem } from "@/types/order.type";
import formatCurrency from "@/utils/price/formatCurrency";
import { router } from "expo-router";

const OrderItemCard = ({ item }: { item: OrderItem }) => {
  const product = item.product || item.service;
  if (!product) return null;
  const imageUrl = product.media?.[0]?.full_url;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/product/${product.id}`)}
      style={{ marginTop: 5 }}
    >
      <View bg-white row centerV>
        <Image
          width={60}
          height={60}
          br20
          source={
            imageUrl
              ? { uri: imageUrl }
              : require("@/assets/images/logo/logo.png")
          }
          defaultSource={require("@/assets/images/logo/logo.png")}
        />

        <View flex marginL-12>
          <Text h3_bold numberOfLines={2}>
            {product?.name || ""}
          </Text>

          <View row spread marginT-4>
            <Text h3 color={Colors.grey30}>
              {item.quantity}x {formatCurrency({ price: item.price })}
            </Text>
            <Text h3_bold secondary>
              {formatCurrency({ price: item.price * item.quantity })}
            </Text>
          </View>

          {item.service_type && (
            <Text h3_bold secondary marginT-4>
              {item.service_type}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItemCard;
