import React from "react";
import { AppStyles } from "@/constants/AppStyles";
import { router } from "expo-router";
import { TouchableOpacity, Image, View, Text } from "react-native-ui-lib";
import StarIcon from "@/assets/icons/star.svg";
import formatCurrency from "@/utils/price/formatCurrency";

interface FavoriteItemProps {
  item: any;
  type: 'product' | 'service';
}

const FavoriteItem: React.FC<FavoriteItemProps> = ({ item, type }) => {
  const itemData = type === 'product' ? item.product : item.service;
  const itemImage =
    itemData.media && itemData.media.length > 0
      ? { uri: itemData.media[0].full_url }
      : require("@/assets/images/home/product1.png");

  const handlePress = () => {
    router.push(`/${type}/${itemData.id}`);
  };

  return (
    <TouchableOpacity
      marginB-10
      style={[{ width: "48%", borderRadius: 12 }, AppStyles.shadowItem]}
      onPress={handlePress}
    >
      <View br50 width="100%" gap-5>
        <Image
          source={itemImage}
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
          {type === 'product' ? itemData.name : itemData.service_name}
        </Text>

        {type === 'product' ? (
          <View flex-1 gap-5 row centerV>
            <Image source={StarIcon} width={15} height={15} />
            <Text style={{ color: "#8C8585" }}>
              5.0 | {itemData?.quantity} có sẵn
            </Text>
          </View>
        ) : (
          <Text style={{ color: "#8C8585" }} numberOfLines={2} ellipsizeMode="tail">
            {itemData.description}
          </Text>
        )}

        <View bottom paddingB-5>
          <Text text70H style={{ color: "#A85A29" }}>
            {formatCurrency({ 
              price: type === 'product' ? itemData.price : itemData.single_price 
            })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default FavoriteItem;
