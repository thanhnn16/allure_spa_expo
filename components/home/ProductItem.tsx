import { AppStyles } from "@/constants/AppStyles";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, Image, View, Text } from "react-native-ui-lib";
import StarIcon from "@/assets/icons/star.svg";
import formatCurrency from "@/utils/price/formatCurrency";

interface RenderProductItemProps {
  item: any;
}

const formatPrice = (price: number): string => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " ₫";
};

const RenderProductItem: React.FC<RenderProductItemProps> = ({ item }) => {
  // Get first image from media array
  const productImage =
    item.media && item.media.length > 0
      ? { uri: item.media[0].full_url }
      : require("@/assets/images/home/product1.png");

  return (
    <TouchableOpacity
      marginH-10
      marginB-10
      style={[{ width: 200, borderRadius: 12 },
      AppStyles.shadowItem
      ]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <View
        br50
        width={200}
        gap-5
      >
        <Image
          source={productImage}
          width={"100%"}
          resizeMode="cover"
          height={170}
          style={{
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />
      </View>
      <View flex paddingH-10 paddingV-5 gap-2>
        <Text text70H numberOfLines={2} ellipsizeMode="tail">
          {item?.name}
        </Text>

        <View flex-1 gap-5 row centerV>
          <Image
            source={StarIcon}
            width={15}
            height={15}
          />
          <Text style={{ color: "#8C8585" }}>
            5.0 | {item?.quantity} có sẵn
          </Text>
        </View>

        <View bottom paddingB-5>
          <Text text70H style={{ color: "#A85A29" }}>
            {formatCurrency({ price: item.price })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderProductItem;
