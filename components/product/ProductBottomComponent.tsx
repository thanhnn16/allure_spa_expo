import {
  View,
  Text,
  TouchableOpacity,
  Button,
  Image,
  SkeletonView,
  Incubator,
} from "react-native-ui-lib";

import { Link, router } from "expo-router";
import i18n from "@/languages/i18n";

import CommentIcon from "@/assets/icons/comment.svg";
import ShoppingCartIcon from "@/assets/icons/shopping-cart.svg";
import { Dimensions } from "react-native";
import { useDispatch } from "react-redux";
import { addItemToCart, CartItem } from "@/redux/features/cart/cartSlice";
import { Product } from "@/types/product.type";

const windowWidth = Dimensions.get("window").width;

interface ProductBottomComponentProps {
  isLoading: boolean;
  product: Product | null;
  onPurchase?: () => void;
}

const ProductBottomComponent: React.FC<ProductBottomComponentProps> = ({
  isLoading = false,
  product,
  onPurchase,
}) => {
  const dispatch = useDispatch();

  const renderCustomContent = () => {
    return (
      <View bg-$backgroundNeutralLight flex padding-10>
        <Text $textDefault text60>This is a custom content</Text>
        <Text $textDefault>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry
          standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to
          make a type specimen book.
        </Text>
      </View>
    );
  };

  const handleAddToCart = () => {
    const cartItem = {
      ...product,
      quantity: 1,
    };
    dispatch(addItemToCart({ product: cartItem }));
    <Incubator.Toast
      visible
      centerMessage
      children={renderCustomContent()}
      message={i18n.t("productDetail.add_to_cart_success").toString()}
      position="bottom"
      autoDismiss={1500}
    >
      
    </Incubator.Toast>;
  };

  const handlePurchase = () => {
    if (onPurchase) {
      onPurchase();
    } else {
      // Xử lý logic mua hàng bình thường
    }
  };

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
        />
      </View>
    </View>
  );
};

export default ProductBottomComponent;
