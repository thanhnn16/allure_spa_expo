import {
  View,
  Text,
  Image,
  Colors,
  TouchableOpacity,
} from "react-native-ui-lib";
import { OrderItem } from "@/types/order.type";
import formatCurrency from "@/utils/price/formatCurrency";
import { router } from "expo-router";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();
import { ServiceResponeModel } from "@/types/service.type";
import { Product } from "@/types/product.type";

const OrderItemCard = ({ item }: { item: OrderItem }) => {
  console.log("Received item: ", item);

  const isService = item.item_type === "service";
  const itemData = isService ? item.service : item.product;
  if (!itemData) {
    console.warn(`No ${isService ? 'service' : 'product'} data found for item:`, item);
    return null;
  }
  const imageUrl = itemData.media?.[0]?.full_url;

  const itemName = isService 
    ? (itemData as ServiceResponeModel)?.service_name 
    : (itemData as Product)?.name;

  return (
    <TouchableOpacity
      onPress={() => router.push(`/(app)/${item.item_type}/${itemData.id}`)}
      style={{ marginVertical: 6 }}
    >
      <View bg-white row centerV>
        <Image
          width={60}
          height={60}
          br20
          source={imageUrl ? { uri: imageUrl } : require("@/assets/images/logo/logo.png")}
        />

        <View flex marginL-12>
          <Text h3_bold numberOfLines={2}>
            {itemName || item.item_name}
          </Text>

          <View row spread marginT-4>
            <Text h3 color={Colors.grey30}>
              {item.quantity}x {formatCurrency({ price: item.price })}
            </Text>
            <Text h3_bold secondary>
              {formatCurrency({ price: item.price * item.quantity })}
            </Text>
          </View>

          {isService && item.service_type && (
            <View
              padding-8
              br20
              center
              backgroundColor={Colors.primary_light}
              marginT-4
              width={"40%"}
            >
              <Text text80 color={Colors.primary}>
                {item.service_type === "combo_5"
                  ? t("orders.combo_5")
                  : t("orders.combo_10")}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default OrderItemCard;
