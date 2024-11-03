import { AppStyles } from "@/constants/AppStyles";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, Image, View, Text } from "react-native-ui-lib";

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

  const formattedPrice = formatPrice(parseFloat(item.price));

  return (
    <TouchableOpacity
      marginR-15
      style={[
        AppStyles.shadowItem,
        { borderRadius: 8, width: 150, height: 270 },
      ]}
      onPress={() => router.push(`/product/${item.id}`)}
    >
      <Image
        source={productImage}
        width={"100%"}
        height={180}
        style={{ resizeMode: "cover" }}
      />
      <View flex paddingH-10 paddingV-5 gap-2>
        <Text text70H numberOfLines={2}>
          {item?.name}
        </Text>
        <View flex-1 gap-5 row>
          <Image
            source={require("@/assets/images/home/icons/yellowStar.png")}
            width={15}
            height={15}
          />
          <Text style={{ color: "#8C8585" }}>
            5.0 | {item?.quantity} có sẵn
          </Text>
        </View>
        <View bottom>
          <Text text70H style={{ color: "#A85A29" }}>
            {formattedPrice}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RenderProductItem;
