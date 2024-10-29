import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  SkeletonView,
} from "react-native-ui-lib";
import { Link, router } from "expo-router";
import i18n from "@/languages/i18n";
import { useState, useEffect } from "react";

import CommentIcon from "@/assets/icons/comment.svg";
import ShoppingCartIcon from "@/assets/icons/shopping-cart.svg";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

interface ProductBottomComponentProps {
  isLoading?: boolean;
}

const ProductBottomComponent: React.FC<ProductBottomComponentProps> = ({
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <View padding-24>
        <SkeletonView height={50} width={windowWidth * 0.8} />
      </View>
    );
  }

  return (
    <View
      row
      centerV
      padding-24
      style={{
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        borderWidth: 2,
        borderColor: "#E0E0E0",
      }}
    >
      <View row gap-30>
        <Link href="/rating/1" asChild>
          <TouchableOpacity>
            <View center marginB-4>
              <Image source={CommentIcon} size={24} />
            </View>
            <Text h3_medium>{i18n.t("productDetail.reviews")}</Text>
          </TouchableOpacity>
        </Link>
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <View center marginB-4>
            <Image source={ShoppingCartIcon} size={24} />
          </View>
          <Text h3_medium>{i18n.t("productDetail.add_to_cart")}</Text>
        </TouchableOpacity>
      </View>
      <View flex right>
        <Button
          label={i18n.t("productDetail.buy_now").toString()}
          primary
          br40
          onPress={() => {
            router.push("/payment");
          }}
        />
      </View>
    </View>
  );
};

export default ProductBottomComponent;
