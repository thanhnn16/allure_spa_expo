import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  Checkbox,
} from "react-native-ui-lib";
import { Dimensions, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import {
  CartItem,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
} from "@/redux/features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";
import formatCurrency from "@/utils/price/formatCurrency";

interface CartProductItemProps {
  product: CartItem;
  dialogVisible?: (visible: boolean) => void;
  setItemDelete?: (id: number) => void;
}

const CartProductItem = ({
  product,
  dialogVisible,
  setItemDelete,
}: CartProductItemProps) => {
  const dispatch = useDispatch();
  const windowWidth = Dimensions.get("window").width;

  const handleGetId = (id: number) => {
    setItemDelete && setItemDelete(id);
  };

  const handleIncreaseQuantity = (id: number) => {
    dispatch(incrementCartItem(id));
  };
  const handleDecreaseQuantity = (id: number) => {
    if (product.cart_quantity == 1) {
      dialogVisible && dialogVisible(true);
      return;
    }
    dispatch(decrementCartItem(id));
  };
  const handleDelete = (id: number) => {
    dispatch(removeCartItem(id));
  };

  const productImage =
    product.media && product.media.length > 0
      ? { uri: product.media[0].full_url }
      : require("@/assets/images/home/product1.png");

  const total = product.price * product.cart_quantity;

  const renderRightActions = () => {
    return (
      <View style={styles.rightActionContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(product.id)}
        >
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  useEffect(() => {
    handleGetId(product.id);
  }, [product.id]);

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View marginB-10>
        <View
          row
          centerV
          style={{
            backgroundColor: "#fff",
            borderTopStartRadius: 13,
            borderTopEndRadius: 13,
            padding: 10,
            borderWidth: 1,
            borderColor: "#e3e4de",
          }}
        >
          <View style={styles.imageContainer}>
            <Image source={productImage} style={styles.productImage} />
          </View>
          <View marginL-16>
            <View width={windowWidth * 0.55}>
              <Text h3_bold>{product.name}</Text>
            </View>
            <View>
              <Text h3_bold secondary>
                {formatCurrency({ price: Number(product?.price) })}
              </Text>
            </View>
            <View>
              <View gap-13 style={styles.quantityContainer}>
                <View style={styles.quantityButtonContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => {
                      handleDecreaseQuantity(product.id);
                    }}
                  >
                    <Text h2_medium>-</Text>
                  </TouchableOpacity>
                </View>
                <Text h2>{product.cart_quantity}</Text>
                <View style={styles.quantityButtonContainer}>
                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => {
                      handleIncreaseQuantity(product.id);
                    }}
                  >
                    <Text h2_medium>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View
          row
          style={{
            justifyContent: "space-between",
            borderBottomStartRadius: 13,
            borderBottomEndRadius: 13,
            backgroundColor: "#e3e4de",
            paddingHorizontal: 10,
            paddingVertical: 5,
          }}
        >
          <Text h3_bold>Tổng tiền:</Text>
          <Text h3_bold secondary>
            {formatCurrency({ price: total })}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default CartProductItem;

const styles = StyleSheet.create({
  productItem: {
    marginBottom: 19,
  },
  imageContainer: {
    borderRadius: 10,
    backgroundColor: "#fff",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  productImage: {
    backgroundColor: "#E0E0E0",
    width: 100,
    height: 100,
    borderRadius: 10,
  },
  productQuantity: {
    fontSize: 14,
    color: "black",
    marginHorizontal: 10,
  },
  quantityContainer: {
    marginTop: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButtonContainer: {
    borderWidth: 1,
    backgroundColor: "#e3e4de",
    borderColor: "#e3e4de",
    borderRadius: 10,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButton: {
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    position: "absolute",
    right: 7,
    top: 10,
  },
  rightActionContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 75,
    backgroundColor: "red",
    marginBottom: 10,
    borderTopEndRadius: 13,
    borderBottomEndRadius: 13,
  },
  actionButton: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
