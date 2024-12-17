import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Button,
  Checkbox,
  Colors,
} from "react-native-ui-lib";
import { Dimensions, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import {
  CartItem,
  incrementCartItem,
  decrementCartItem,
  removeCartItem,
} from "@/redux/features/cart/cartSlice";
import { useDispatch } from "react-redux";
import { Swipeable } from "react-native-gesture-handler";
import formatCurrency from "@/utils/price/formatCurrency";
import { useLanguage } from "@/hooks/useLanguage";
import { useDialog } from "@/hooks/useDialog";
import AppDialog from "@/components/dialog/AppDialog";
import { TextInput } from "react-native";

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
  const { t } = useLanguage();
  const { showDialog, dialogConfig, hideDialog } = useDialog();
  const [showQuantityDialog, setShowQuantityDialog] = useState(false);
  const [tempQuantity, setTempQuantity] = useState('');

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

  const handleQuantityPress = () => {
    setShowQuantityDialog(true);
  };

  const handleQuantityConfirm = () => {
    const newQuantity = parseInt(tempQuantity);
    if (isNaN(newQuantity) || newQuantity < 1) {
      showDialog(
        t("common.error"),
        t("productDetail.invalid_quantity"),
        "error"
      );
      return;
    }

    // Cập nhật số lượng mới
    const currentQuantity = product.cart_quantity;
    const diff = newQuantity - currentQuantity;

    if (diff > 0) {
      // Tăng số lượng
      for (let i = 0; i < diff; i++) {
        handleIncreaseQuantity(product.id);
      }
    } else if (diff < 0) {
      // Giảm số lượng
      for (let i = 0; i < Math.abs(diff); i++) {
        if (newQuantity === 0) {
          dialogVisible && dialogVisible(true);
          break;
        }
        handleDecreaseQuantity(product.id);
      }
    }

    setShowQuantityDialog(false);
    setTempQuantity('');
  };

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
                <TouchableOpacity onPress={handleQuantityPress}>
                  <Text h2>{product.cart_quantity}</Text>
                </TouchableOpacity>
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

      <AppDialog
        visible={showQuantityDialog}
        title={t("productDetail.enter_quantity")}
        closeButtonLabel={t("common.cancel")}
        confirmButtonLabel={t("common.confirm")}
        severity="info"
        onClose={() => {
          setShowQuantityDialog(false);
          setTempQuantity('');
        }}
        onConfirm={handleQuantityConfirm}
        children={
          <TextInput
            style={{
              borderWidth: 1,
              borderColor: Colors.border,
              borderRadius: 8,
              padding: 10,
              marginTop: 10,
            }}
            keyboardType="numeric"
            inputMode="numeric"
            value={tempQuantity}
            onChangeText={setTempQuantity}
            placeholder={t("productDetail.enter_quantity")}
            maxLength={2}
            autoFocus={true}
          />
        }
      />

      <AppDialog
        visible={dialogConfig.visible}
        title={dialogConfig.title}
        description={dialogConfig.description}
        closeButtonLabel={t("close")}
        severity={dialogConfig.severity}
        onClose={hideDialog}
        confirmButton={false}
      />
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
