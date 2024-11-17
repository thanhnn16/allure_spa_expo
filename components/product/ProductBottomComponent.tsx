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
import { resetOrders } from "@/redux/features/order/orderSlice";
// import { setOrderProducts } from '@/redux/features/order/orderSlice';

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
  onAddToCart,
}) => {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    if (quantity === 0) {
      setIsVisible(true);
      return;
    }
    const cartItem = {
      ...product,
    };
    dispatch(addItemToCart({ product: cartItem, cart_quantity: quantity }));
    dispatch(resetOrders())
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
        priceValue: product?.price || 0,
        quantity: quantity,
        image: product?.media?.[0]?.full_url || "",
        type: "product"
      };

      // dispatch(setOrderProducts({
      //   products: [productData],
      //   totalAmount: Number(product?.price || 0) * quantity,
      //   fromCart: false
      // }));

      router.push("/check-out");
    }
  };

  if (isLoading) {
    return (
      <View padding-24>
        <SkeletonView height={50} width={windowWidth * 0.85} />
      </View>
    );
  }

  const [isVisible, setIsVisible] = useState(false);

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
      <Incubator.Toast
        visible={isVisible}
        position={'bottom'}
        autoDismiss={1500}
        onDismiss={() => setIsVisible(false)}
      >
        <View row centerV gap-10 paddingH-20 paddingV-10 backgroundColor={Colors.primary_light}>
          <Image source={ShoppingCartIcon} size={24} />
          <Text h3_medium>Cần thêm số lượng sản phẩm</Text>
        </View>
      </Incubator.Toast>
    </View>
  );
};

export default ProductBottomComponent;
