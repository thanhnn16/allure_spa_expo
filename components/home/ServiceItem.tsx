import { router } from "expo-router";
import React from "react";
import { TouchableOpacity, Image, View, Text } from "react-native-ui-lib";
import formatCurrency from "@/utils/price/formatCurrency";
import { AppStyles } from "@/constants/AppStyles";

interface RenderServiceItemProps {
  item: any;
  widthItem: number;
  heightItem: number;
  heightImage: number;
}

const ServiceItem: React.FC<RenderServiceItemProps> = ({ item, widthItem, heightItem, heightImage }) => {
  console.log(item.id)
  const serviceImage =
    item.media && item.media.length > 0
      ? { uri: item.media[0].full_url }
      : require("@/assets/images/logo/logo.png");
  return (
    <TouchableOpacity
      marginH-10
      marginB-10
      style={[{ width: widthItem, height: heightItem, borderRadius: 12 }, 
        AppStyles.shadowItem
      ]}
      onPress={() => router.push(`/service/${item.id}`)}
    >
      <View width={widthItem}>
        <Image
          source={serviceImage}
          resizeMode="cover"
          width={"100%"}
          height={heightImage}
          errorSource={require("@/assets/images/logo/logo.png")}
          style={{
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
          }}
        />
      </View>
      <View flex paddingH-12 gap-2>
        <View>
          <Text text70H numberOfLines={2} ellipsizeMode="tail">
            {item.service_name}
          </Text>
        </View>

        <View>
          <Text style={{ color: "#8C8585" }} numberOfLines={2} ellipsizeMode="tail">
            {item.description}
          </Text>
        </View>

        <View absB marginH-12 marginB-10>
          <Text text70H style={{ color: "#A85A29" }} marginT-10>
            {formatCurrency({ price: item.single_price })}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ServiceItem; 