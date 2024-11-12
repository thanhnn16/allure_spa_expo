import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  SkeletonView,
  Incubator,
  Colors,
} from "react-native-ui-lib";

import { Link, router } from "expo-router";
import i18n from "@/languages/i18n";

import CommentIcon from "@/assets/icons/comment.svg";
import ShoppingCartIcon from "@/assets/icons/shopping-cart.svg";
import { Dimensions } from "react-native";
import { useDispatch } from "react-redux";
import { addItemToCart } from "@/redux/features/cart/cartSlice";
import { Product } from "@/types/product.type";
import { useState } from "react";

const windowWidth = Dimensions.get("window").width;

interface ProductBottomComponentProps {
  isLoading: boolean;
  product: Product | null;
  onPurchase?: () => void;
  quantity: number;
  onAddToCart?: () => void;
}

const ProductBottomComponent: React.FC<ProductBottomComponentProps> = ({
  isLoading = false,
  product,
  onPurchase,
  quantity,
  onAddToCart
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity: 1,
    };
    dispatch(addItemToCart({ product: cartItem, quantity: quantity }));
    onAddToCart && onAddToCart();
  };

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase();
    } else {
      const productData = {
        id: product?.id,
        name: product?.name,
        price: product?.price,
        quantity: quantity,
        image: product?.media?.[0]?.full_url,
        type: "product",
      };

      router.push({
        pathname: "/(app)/payment",
        params: {
          products: JSON.stringify([productData]),
          total_amount: Number(product?.price || 0) * quantity,
        },
      });
    }
  };

  if (isLoading) {
    return (
      <View padding-24>
        <SkeletonView height={50} width={windowWidth * 0.85} />
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
        <TouchableOpacity onPress={() => handleAddToCart()}>
          <View center marginB-4>
            <Image source={ShoppingCartIcon} size={24} />
          </View>
          <Text h3_medium>{i18n.t("productDetail.add_to_cart")}</Text>
        </TouchableOpacity>
      </View>
      <View flex right>
        <Button
          label={i18n.t("productDetail.buy_now").toString()}
          br40
          onPress={handlePurchase}
          backgroundColor={Colors.primary}
        />
      </View>

    </View>
  );
};

export default ProductBottomComponent;
