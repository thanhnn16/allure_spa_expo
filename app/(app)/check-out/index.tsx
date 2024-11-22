import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  ImageSourcePropType,
  Alert,
  TouchableOpacity,
  TextInput,
  Linking,
} from "react-native";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import VoucherDropdown from "@/components/payment/VoucherDropdown";
import PaymentPicker from "@/components/payment/PaymentPicker";
import PaymentProductItem from "@/components/payment/PaymentProductItem";
import i18n from "@/languages/i18n";
import formatCurrency from "@/utils/price/formatCurrency";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Voucher } from "@/types/voucher.type";
import { getAllVouchersThunk } from "@/redux/features/voucher/getAllVoucherThunk";
import AppDialog from "@/components/dialog/AppDialog";
import OrderService from "@/services/OrderService";
import { useAuth } from "@/hooks/useAuth";
import { clearCart } from "@/redux/features/cart/cartSlice";
import { OrderItem } from "@/types";
import { Product } from "@/types/product.type";
import { useDialog } from "@/hooks/useDialog";
import { fetchAddresses } from "@/redux/features";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AppButton from "@/components/buttons/AppButton";
import { Address, UserProfile } from "@/types/address.type";
import { selectCheckoutItems } from "@/redux/features/cart/cartSlice";
import { ServiceResponeModel } from "@/types/service.type";
import { CheckoutOrderItem } from "@/types/order.type";

export interface PaymentMethod {
  id: number;
  name: string;
  icon?: ImageSourcePropType;
  iconName: string;
  code?: string;
}
const paymentMethods: PaymentMethod[] = [
  {
    id: 1,
    name: i18n.t("checkout.cash"),
    iconName: "cash-outline",
  },
  {
    id: 2,
    name: i18n.t("checkout.credit_card"),
    iconName: "card-outline",
  },
  {
    id: 3,
    name: i18n.t("checkout.bank_transfer"),
    iconName: "card-outline",
  },
];

export default function Checkout() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [activeVouchers, setactiveVoucher] = useState<Voucher[]>([]);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [paymentDialog, setPaymentDialog] = useState(false);
  const [createOrderDialog, setCreateOrderDialog] = useState(false);
  const { dialogConfig, showDialog, hideDialog } = useDialog();
  const [note, setNote] = useState("");

  const checkoutItems = useSelector(selectCheckoutItems) as CheckoutOrderItem[];
  const cartTotalAmount = useSelector((state: RootState) => state.cart.totalAmount);
  const addresses = useSelector((state: RootState) => state.address.addresses);
  const userProfile = useSelector((state: RootState) => state.auth.user);
  const vouchers = useSelector((state: RootState) => state.voucher.vouchers);

  const calculateTotalPrice = () => {
    if (!checkoutItems || checkoutItems.length === 0) return 0;

    return checkoutItems.reduce((total: number, item: CheckoutOrderItem) => {
      return total + (item.price * item.quantity);
    }, 0);
  };

  const calculateDiscountedPrice = (price: number, voucher: Voucher) => {
    let priceWithDiscount: number;
    if (voucher && voucher.discount_type === "percentage") {
      priceWithDiscount = price - (price * voucher.discount_value) / 100;
    } else {
      priceWithDiscount = price - voucher.discount_value;
    }
    return priceWithDiscount;
  };

  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice());
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);

  const handlePaymentSelect = (payment: PaymentMethod) => {
    if (payment.id === 2) {
      showDialog(
        "Thanh toán bằng thẻ tín dụng",
        "Chức năng thanh toán bằng thẻ tín dụng đang phát triển, vui lòng chọn phương thức thanh toán khác.",
        "info"
      );
    } else {
      setSelectedPayment(payment);
    }
  };

  const handleVoucherSelect = (voucher: Voucher) => {
    setVoucher(voucher);
    setSelectedVoucher(voucher);
    const newPrice = calculateDiscountedPrice(totalPrice, voucher);
    setDiscountedPrice(newPrice);
  };

  const loadSelectedAddress = async () => {
    try {
      const savedAddress = await AsyncStorage.getItem("selectedAddress");
      if (savedAddress) {
        setSelectedAddress(JSON.parse(savedAddress));
      }
    } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
    }
  };

  const handlePayment = async () => {
    try {
      if (!selectedAddress) {
        showDialog(
          i18n.t("checkout.address_required_title"),
          i18n.t("checkout.address_required_message"),
          "warning"
        );
        return;
      }

      // Format order data theo cấu trúc API mới
      const orderData = {
        payment_method_id: selectedPayment.id,
        shipping_address_id: selectedAddress.id,
        voucher_id: selectedVoucher?.id || null,
        note: note || "",
        items: checkoutItems.map((item: CheckoutOrderItem) => ({
          item_id: item.item_id,
          item_type: item.item_type,
          quantity: item.quantity,
          price: item.price,
          ...(item.item_type === "service" && {
            service_type: item.service_type || "single",
          }),
        })),
      };

      // Create order
      const orderResponse = await OrderService.createOrder(orderData);
      const { id: orderId, total_amount: serverCalculatedAmount } =
        orderResponse.data;

      // Handle payment methods
      if (selectedPayment.id === 1) {
        // Cash payment
        router.replace({
          pathname: "/(app)/invoice/success",
          params: {
            order_id: orderId,
            amount: serverCalculatedAmount.toString(),
            payment_time: new Date().toISOString(),
            payment_method: "cash",
          },
        });
        dispatch(clearCart());
      } else if (selectedPayment.id === 3) {
        // Bank transfer
        const scheme = __DEV__ ? "exp+allurespa" : "allurespa";

        const paymentData = {
          returnUrl: `${scheme}://invoice/success?order_id=${orderId}&amount=${serverCalculatedAmount}&payment_method=bank_transfer&payment_time=${new Date().toISOString()}`,
          cancelUrl: `${scheme}://invoice/failed?type=cancel&order_id=${orderId}&payment_method=bank_transfer`,
        };

        const paymentResponse = await OrderService.processPayment(
          orderId,
          paymentData
        );

        if (paymentResponse.data?.checkoutUrl) {
          await Linking.openURL(paymentResponse.data.checkoutUrl);
        }
      }
    } catch (error) {
      console.error("Payment error:", error);
      showDialog(
        i18n.t("common.error"),
        i18n.t("checkout.payment_failed"),
        "error"
      );
    }
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        await dispatch(getAllVouchersThunk());
        if (vouchers) {
          setactiveVoucher(vouchers.filter((v: Voucher) => v.is_active));
        }
      } catch (error) {
        console.error("Error fetching vouchers:", error);
      }
    };

    fetchVouchers();
  }, [dispatch]);

  useEffect(() => {
    setDiscountedPrice(totalPrice);
  }, [totalPrice]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadSelectedAddress();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (checkoutItems.length === 0) {
      router.back();
      return;
    }

    const initialTotal = calculateTotalPrice();
    setTotalPrice(initialTotal);
    setDiscountedPrice(initialTotal);
  }, [checkoutItems]);

  useEffect(() => {
    loadAddressData();
  }, []);

  const loadAddressData = async () => {
    try {
      // Load addresses from redux
      await dispatch(fetchAddresses()).unwrap();

      // Check for previously selected address
      const savedAddress = await AsyncStorage.getItem("selectedAddress");
      if (savedAddress) {
        setSelectedAddress(JSON.parse(savedAddress));
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  };

  const renderAddressSection = () => {
    if (addresses.length === 0) {
      return (
        <View style={styles.noAddressContainer}>
          <Text style={styles.noAddressText}>
            {i18n.t("checkout.no_address")}
          </Text>
          <AppButton
            type="primary"
            onPress={() => router.push("/(app)/address/add")}
          >
            <Text style={styles.buttonText}>
              {i18n.t("address.add_new_address")}
            </Text>
          </AppButton>
        </View>
      );
    }

    return (
      <TouchableOpacity
        style={styles.addressContainer}
        onPress={() => router.push("/(app)/address")}
      >
        {selectedAddress ? (
          <View flexS>
            <Text style={styles.addressTitle}>
              {i18n.t("checkout.delivery_address")}
            </Text>
            <Text style={styles.addressText}>
              {selectedAddress.address}, {selectedAddress.ward},{" "}
              {selectedAddress.district}, {selectedAddress.province}
            </Text>
            <Text style={styles.recipientText}>
              {userProfile?.full_name} | {userProfile?.phone_number}
            </Text>
          </View>
        ) : (
          <Text style={styles.selectAddressText}>
            {i18n.t("checkout.select_address")}
          </Text>
        )}
        <MaterialCommunityIcons name="chevron-right" size={24} color="#666" />
      </TouchableOpacity>
    );
  };

  const renderOrderItems = () => {
    return checkoutItems.map((item: CheckoutOrderItem) => (
      <PaymentProductItem
        key={`${item.item_type}-${item.item_id}`}
        orderItem={{
          item_id: item.item_id,
          item_type: item.item_type,
          quantity: item.quantity,
          price: item.price,
          service_type: item.service_type,
          [item.item_type]: item.item_type === "product" ? item.product : item.service,
        }}
      />
    ));
  };

  return (
    <View flex bg-white>
      <AppBar back title={i18n.t("checkout.title")} />
      <View flex backgroundColor={Colors.white}>
        <ScrollView
          style={{ paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {renderAddressSection()}

          <View marginV-10 gap-10>
            <Text h2_bold>{i18n.t("checkout.voucher")}</Text>
            <VoucherDropdown
              value={voucher}
              items={activeVouchers}
              onSelect={handleVoucherSelect}
            />
          </View>

          <View style={styles.borderInset} />

          <View marginV-10 gap-10>
            <Text h2_bold>{i18n.t("checkout.payment_method")}</Text>
            <PaymentPicker
              value={selectedPayment}
              items={paymentMethods}
              onSelect={handlePaymentSelect}
            />
          </View>

          <View style={styles.borderInset} />

          <View marginV-10 gap-10>
            <Text h2_bold>{i18n.t("checkout.product")}</Text>
            {renderOrderItems()}
          </View>

          <View style={styles.borderInset} />

          <View marginV-10>
            <Text h2_bold>Note</Text>
            <TextInput
              value={note}
              placeholder={i18n.t("address.note")}
              onChangeText={(value) => setNote(value)}
              multiline={true}
              numberOfLines={3}
              style={{
                fontSize: 14,
                minHeight: 80,
                width: "100%",
                padding: 15,
                backgroundColor: "#ffffff",
                borderRadius: 8,
                textAlignVertical: "top",
                borderWidth: 1,
                borderColor: "#E5E7EB",
                marginTop: 10,
              }}
            />
          </View>
        </ScrollView>

        <View
          style={{
            borderTopWidth: 1,
            borderLeftWidth: 1,
            borderRightWidth: 1,
            borderTopColor: "#E0E0E0",
            borderLeftColor: "#E0E0E0",
            borderRightColor: "#E0E0E0",
            borderTopLeftRadius: 13,
            borderTopRightRadius: 13,
            backgroundColor: "#FFFFFF",
            padding: 20,
          }}
        >
          <View>
            <View row centerV spread>
              <Text h3_bold>{i18n.t("checkout.subtotal")}</Text>
              <Text h3_bold>{formatCurrency({ price: totalPrice })}</Text>
            </View>
            <View row centerV spread marginT-10>
              <Text h3_bold>{i18n.t("checkout.voucher")}</Text>
              <Text h3>{selectedVoucher ? selectedVoucher.code : ""}</Text>
            </View>
            <View row centerV spread marginV-10>
              <Text h3_bold>{i18n.t("checkout.total_payment")}</Text>
              <View>
                {discountedPrice !== totalPrice && (
                  <Text
                    h3
                    style={{
                      textDecorationLine: "line-through",
                      color: Colors.grey30,
                      fontSize: 12,
                      textAlign: "right",
                    }}
                  >
                    {formatCurrency({ price: totalPrice })}
                  </Text>
                )}
                <Text h3_bold secondary>
                  {formatCurrency({ price: discountedPrice })}
                </Text>
              </View>
            </View>

            <Button
              label={i18n.t("checkout.payment").toString()}
              labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
              backgroundColor={Colors.primary}
              padding-20
              style={{ height: 50 }}
              borderRadius={13}
              onPress={() => handlePayment()}
            />
          </View>
        </View>
        <AppDialog
          visible={paymentDialog}
          title={"Xác nhận xóa sản phẩm"}
          description={
            "Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"
          }
          closeButtonLabel={i18n.t("common.cancel")}
          confirmButtonLabel={"Xóa"}
          severity="info"
          onClose={() => setPaymentDialog(false)}
        />

        <AppDialog {...dialogConfig} onClose={hideDialog} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  totalSection: {
    padding: 10,
    backgroundColor: "#f8f8f8",
    marginHorizontal: 20,
    borderRadius: 8,
  },
  borderInset: {
    width: 370,
    height: 2,
    backgroundColor: "#717658",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  noAddressContainer: {
    padding: 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  noAddressText: {
    marginBottom: 16,
    color: "#666",
  },
  addressContainer: {
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  addressText: {
    color: "#666",
    marginBottom: 4,
  },
  recipientText: {
    color: "#666",
  },
  selectAddressText: {
    color: "#666",
  },
  buttonText: {
    color: "#fff",
  },
});
