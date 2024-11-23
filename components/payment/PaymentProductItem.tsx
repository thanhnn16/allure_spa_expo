import { CheckoutOrderItem } from "@/types/order.type";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();
import formatCurrency from "@/utils/price/formatCurrency";
import { Dimensions, StyleSheet } from "react-native";
import { Text, View, Image } from "react-native-ui-lib";

interface PaymentProductItemProps {
  orderItem: CheckoutOrderItem;
}

const PaymentProductItem = ({ orderItem }: PaymentProductItemProps) => {
  const windowWidth = Dimensions.get("window").width;
  const total = orderItem.price * orderItem.quantity;

  // Get item details based on type
  const itemName =
    orderItem.item_type === "product"
      ? orderItem.product?.name
      : orderItem.service?.service_name;

  const itemImage =
    orderItem.item_type === "product"
      ? orderItem.product?.media?.[0]?.full_url
      : orderItem.service?.media?.[0]?.full_url;

  // Handle service type display
  const renderServiceType = () => {
    if (orderItem.item_type === "service" && orderItem.service_type) {
      return (
        <View>
          <Text>
            {orderItem.service_type === "combo_5" ? "5 buổi" : "10 buổi"}
          </Text>
        </View>
      );
    }
    return null;
  };

  return (
    <View key={orderItem.item_id} marginB-10>
      <View
        row
        centerV
        style={{
          backgroundColor: "#fff",
          borderTopStartRadius: 13,
          borderTopEndRadius: 13,
          padding: 10,
          borderWidth: 1,
          borderColor: "#rgba(113, 118, 88, 0.2)",
        }}
      >
        <View style={styles.imageContainer}>
          {itemImage ? (
            <Image source={{ uri: itemImage }} style={styles.productImage} />
          ) : (
            <Image
              source={require("@/assets/images/268268.png")}
              style={styles.productImage}
            />
          )}
        </View>
        <View marginL-16>
          <View width={windowWidth * 0.55}>
            <Text h3_bold>{itemName}</Text>
          </View>
          {renderServiceType()}
          <View>
            <Text h3_bold secondary>
              {formatCurrency({ price: orderItem.price })}
            </Text>
          </View>
          <View>
            <Text>
              {t("checkout.amount")}: {orderItem.quantity}
            </Text>
          </View>
        </View>
      </View>
      <View
        row
        style={{
          justifyContent: "space-between",
          borderBottomStartRadius: 13,
          borderBottomEndRadius: 13,
          backgroundColor: "#rgba(113, 118, 88, 0.2)",
          paddingHorizontal: 10,
          paddingVertical: 5,
        }}
      >
        <Text h3_bold>{t("checkout.total")}:</Text>
        <Text h3_bold secondary>
          {formatCurrency({ price: total })}
        </Text>
      </View>
    </View>
  );
};

export default PaymentProductItem;

const styles = StyleSheet.create({
  productItem: {
    marginBottom: 19,
  },
  imageContainer: {
    borderRadius: 10,
    backgroundColor: "#fff",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    backgroundColor: "#E0E0E0",
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});
