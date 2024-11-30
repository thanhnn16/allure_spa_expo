import { CheckoutOrderItem } from "@/types/order.type";
import formatCurrency from "@/utils/price/formatCurrency";
import { Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { View, Text, Colors, SkeletonView, Image } from "react-native-ui-lib";
import {
  ServiceDetailResponeModel,
  ServiceResponeModel,
} from "@/types/service.type";
import { Product } from "@/types/product.type";
import { useLanguage } from "@/hooks/useLanguage";
import { useEffect } from "react";

interface PaymentItemProps {
  orderItem: CheckoutOrderItem;
}

const PaymentItem = ({ orderItem }: PaymentItemProps) => {
  const { t } = useLanguage();

  if (
    !orderItem.item_id ||
    !orderItem.item_type ||
    (!orderItem.product && !orderItem.service)
  ) {
    console.error("Invalid orderItem:", orderItem);
    return (
      <View
        bg-surface_light
        br30
        padding-16
        margin-10
        border-1
        style={{
          borderColor: Colors.border,
        }}
      >
        <Text h3_bold>Lỗi: Không có thông tin sản phẩm/dịch vụ</Text>
      </View>
    );
  }

  const isService = orderItem.item_type === "service";
  const itemData = isService ? orderItem.service : orderItem.product;
  const itemName = isService
    ? (itemData as ServiceDetailResponeModel)?.service_name
    : (itemData as Product)?.name;
  const imageUrl = itemData?.media?.[0]?.full_url;

  return (
    <View
      bg-surface_light
      br30
      margin-10
      border-1
      style={{
        borderColor: Colors.border,
      }}
    >
      <View row spread marginT-10 padding-16>
        {imageUrl ? (
          <Animated.Image
            source={{ uri: imageUrl }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 13,
            }}
            resizeMode="cover"
          />
        ) : (
          <Image
            source={require("@/assets/images/logo/logo.png")}
            style={{
              width: 100,
              height: 100,
              borderRadius: 13,
            }}
          />
        )}

        <View flex marginL-10>
          <Text h3_bold numberOfLines={2}>
            {itemName}
          </Text>
          <Text h3 color={Colors.grey30} marginT-4>
            {t("checkout.amount")}: {orderItem.quantity}
          </Text>
          <Text h3_bold primary marginT-4>
            {formatCurrency({ price: Number(orderItem.price) })}
          </Text>
          {isService && orderItem.service_type && (
            <View
              paddingH-12
              paddingV-4
              br20
              backgroundColor={Colors.primary_light}
              marginT-8
            >
              <Text text80 color={Colors.primary}>
                {orderItem.service_type === "combo_5"
                  ? t("package.combo5")
                  : orderItem.service_type === "combo_10"
                  ? t("package.combo10")
                  : t("package.single")}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View height={1} bg-border marginT-16 />

      <View row spread padding-16>
        <Text h3_bold>{t("checkout.total")}</Text>
        <Text h3_bold secondary>
          {formatCurrency({
            price: Number(orderItem.price) * orderItem.quantity,
          })}
        </Text>
      </View>
    </View>
  );
};

export default PaymentItem;
