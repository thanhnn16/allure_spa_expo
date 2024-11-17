import i18n from "@/languages/i18n";
import { useState } from "react";
import { Dimensions } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  SkeletonView,
} from "react-native-ui-lib";

const windowWidth = Dimensions.get("window").width;

interface ProductQuantityProps {
  isLoading?: boolean;
  quantity: number;
  maxQuantity?: number;
  setQuantity: (quantity: number) => void;
}

const ProductQuantity: React.FC<ProductQuantityProps> = ({
  isLoading = false,
  quantity,
  setQuantity,
  maxQuantity,
}) => {
  if (isLoading) {
    return (
      <View marginV-10 marginH-20>
        <SkeletonView height={40} width={windowWidth * 0.8} />
      </View>
    );
  }

  return (
    <View
      row
      marginV-10
      marginH-20
      style={{
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Text h2_medium>{i18n.t("productDetail.quantity")}</Text>
      <View
        row
        gap-10
        centerV
        style={{
          borderWidth: 1,
          borderColor: "#E0E0E0",
          borderRadius: 10,
        }}
      >
        <TouchableOpacity
          style={{
            padding: 10,
          }}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Text h2>-</Text>
        </TouchableOpacity>
        <Text style={{ padding: 10 }}>{quantity}</Text>
        <TouchableOpacity
          style={{
            padding: 10,
          }}
          onPress={() => setQuantity(Math.min(maxQuantity || 0, quantity + 1))}
        >
          <Text h2>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProductQuantity;
