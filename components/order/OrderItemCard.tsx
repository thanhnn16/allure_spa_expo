import { View, Text, Image, Colors } from "react-native-ui-lib";
import { OrderItem } from "@/types/order.type";
import formatCurrency from "@/utils/price/formatCurrency";

const OrderItemCard = ({ item }: { item: OrderItem }) => {
  const product = item.product || item.service;
  if (!product) return null;

  console.log("Product:", product);

  const imageUrl = product.media?.[0]?.full_url;

  return (
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
        <Text text80BO numberOfLines={2}>
          {product?.name || ""}
        </Text>

        <View row spread marginT-4>
          <Text text80L color={Colors.grey30}>
            {item.quantity}x {formatCurrency({ price: item.price })}
          </Text>
          <Text text80BO color={Colors.primary}>
            {formatCurrency({ price: item.price * item.quantity })}
          </Text>
        </View>

        {item.service_type && (
          <Text text90L color={Colors.grey30} marginT-4>
            {item.service_type}
          </Text>
        )}
      </View>
    </View>
  );
};

export default OrderItemCard;
