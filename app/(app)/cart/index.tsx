import { useEffect, useState } from "react";
import { View, Text, Image, Button, Colors } from "react-native-ui-lib";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import { useDispatch, useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  CartItem,
  clearCart,
  removeCartItem,
  setCartItems,
} from "@/redux/features/cart/cartSlice";
import CartProductItem from "@/components/cart/CartProductItem";
import { RootState } from "@/redux/store";
import CartEmptyIcon from "@/assets/icons/cart_empty.svg";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import formatCurrency from "@/utils/price/formatCurrency";
import AppDialog from "@/components/dialog/AppDialog";
import {
  setOrderProducts,
  clearOrder,
} from "@/redux/features/order/orderSlice";
import { useLanguage } from "@/hooks/useLanguage";
import { useDialog } from "@/hooks/useDialog";
import AppButton from "@/components/buttons/AppButton";
import { useAuth } from "@/hooks/useAuth";


export default function Cart() {
  const { t } = useLanguage();
  const { signOut } = useAuth();

  const dispatch = useDispatch();
  const [cartDialog, setCartDialog] = useState(false);
  const [setItemDelete, setsetItemDelete] = useState<Number>();
  const { items, totalAmount } = useSelector((state: RootState) => state.cart);
  const { dialogConfig, showDialog, hideDialog } = useDialog();
  const userProfile = useSelector((state: RootState) => state.user.user);

  const CART_ITEMS_KEY = "@cart_items";
  useEffect(() => {
    const loadCart = async () => {
      try {
        const cartItems = await AsyncStorage.getItem(CART_ITEMS_KEY);
        if (cartItems) {
          dispatch(setCartItems(JSON.parse(cartItems)));
        }
      } catch (error) {
        console.error("Error loading cart items:", error);
      }
    };
    loadCart();

    return () => {
      dispatch(clearOrder());
    };
  }, []);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleDelete = (id: number) => {
    dispatch(removeCartItem(id));
  };

  const handleDeleteConfirm = () => {
    setCartDialog(false);
    if (setItemDelete !== null) {
      handleDelete(Number(setItemDelete));
    }
  };

  const formattedPrice = formatCurrency({ price: totalAmount });

  const CartEmpty = () => {
    return (
      <View flex center>
        <Pressable
          onPress={() => router.back()}
          style={{ alignItems: "center" }}
        >
          <Image source={CartEmptyIcon} style={{ width: 200, height: 200 }} />
          <Text h2_bold marginT-20>
            {t("checkout.cart_empty")}
          </Text>
          <View marginT-10>
            <Text h3>{t("checkout.discover_other_products")}</Text>
          </View>
        </Pressable>
      </View>
    );
  };

  const CartHaveItems = () => {
    return (
      <View flex paddingH-20>
        <View right paddingB-5>
          <TouchableOpacity onPress={handleClearCart}>
            <Text h3_bold secondary>
              {t("checkout.clear_all")}
            </Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={items}
          renderItem={({ item }) => (
            <CartProductItem
              product={item}
              dialogVisible={setCartDialog}
              setItemDelete={setsetItemDelete}
            />
          )}
          keyExtractor={(item, index) => `${item.id}-${index}`}
        />
        <View row spread br20 paddingV-12 paddingH-20 marginB-20 backgroundColor={Colors.rgba(Colors.primary, 0.08)}>
          <Text h3_bold>{t("checkout.total_amount")}: </Text>
          <Text h3_bold secondary>
            {formattedPrice}
          </Text>
        </View>

        <AppButton
          type="primary"
          title={t("continue")}
          onPress={handleCheckout}
        />
      </View>
    );
  };

  const handleCheckout = () => {
    if (!userProfile) {
      showDialog(
        t("auth.login.login_required"),
        t("auth.login.login_buy_product"),
        "info",
      );
      return;
    }

    const checkoutItems = items.map((item: CartItem) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      priceValue: item.price,
      quantity: item.cart_quantity,
      image: item.media?.[0]?.full_url || item.media?.[0]?.full_url,
      type: item.item_type,
      service_type: item.service_type,
    }));

    dispatch(
      setOrderProducts({
        items: checkoutItems,
        totalAmount: totalAmount,
        fromCart: true,
      })
    );

    router.push("/check-out");
  };

  return (
    <GestureHandlerRootView>
      <View flex bg-white paddingB-20>
        <AppBar title={t("checkout.cart")} back />
        {items.length === 0 ? <CartEmpty /> : <CartHaveItems />}
      </View>

      <AppDialog
        visible={cartDialog}
        title={t("checkout.delete_cart_confirm")}
        description={
          t("checkout.delete_cart_confirm_message")
        }
        closeButtonLabel={t("common.cancel")}
        confirmButtonLabel={t("common.confirm")}
        severity="info"
        onClose={() => setCartDialog(false)}
        onConfirm={() => handleDeleteConfirm()}
      />

      <AppDialog {...dialogConfig} onClose={hideDialog} onConfirm={() => { signOut() }} confirmButtonLabel={t("common.confirm")} />
    </GestureHandlerRootView>
  );
}
