import AppBar from "@/components/app-bar/AppBar";
import PaymentPicker from "@/components/payment/PaymentPicker";
import PaymentItem from "@/components/payment/PaymentItem";
import { useLanguage } from "@/hooks/useLanguage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useNavigation } from "expo-router";
import { useEffect, useState, useRef, useMemo } from "react";
import { Animated } from "react-native";
import * as Haptics from "expo-haptics";

import {
  Colors,
  Text,
  View,
  KeyboardAwareScrollView,
} from "react-native-ui-lib";

import AppDialog from "@/components/dialog/AppDialog";
import { useDialog } from "@/hooks/useDialog";
import { fetchAddresses } from "@/redux/features";
import {
  clearCart,
  selectCheckoutItems,
} from "@/redux/features/cart/cartSlice";
import { clearTempOrder } from "@/redux/features/order/orderSlice";
import { getAllVouchersThunk } from "@/redux/features/voucher/getAllVoucherThunk";
import { RootState } from "@/redux/store";
import OrderService from "@/services/OrderService";
import { Address, TempAddress } from "@/types/address.type";
import { CheckoutOrderItem, OrderRequest } from "@/types/order.type";
import { Voucher } from "@/types/voucher.type";
import formatCurrency from "@/utils/price/formatCurrency";
import { useLocalSearchParams } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import PaymentAddress from "@/components/payment/PaymentAddress";
import { StyleSheet } from "react-native";
import VoucherDropdown from "@/components/payment/VoucherDropdown";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { setSelectedAddress as setReduxSelectedAddress } from "@/redux/features/address/addressSlice";
import * as Linking from "expo-linking";
import AppButton from "@/components/buttons/AppButton";

export interface PaymentMethod {
  id: number;
  name: string;
  iconName: string;
  iconType?: "Ionicons" | "MaterialCommunityIcons";
}

const presets = {
  field: {
    borderWidth: 1,
    borderColor: Colors.grey50,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
    height: 44,
  },
  section: {
    marginBottom: 16,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
};

export default function Checkout() {
  const { t } = useLanguage();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      name: t("checkout.cash"),
      iconName: "cash-outline",
    },
    {
      id: 2,
      name: t("checkout.credit_card"),
      iconName: "card-outline",
    },
    {
      id: 3,
      name: t("checkout.bank_transfer"),
      iconName: "card-outline",
    },
  ];

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [activeVouchers, setactiveVoucher] = useState<Voucher[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const { dialogConfig, showDialog, hideDialog } = useDialog();
  const [note, setNote] = useState("");
  const { source } = useLocalSearchParams();

  const tempOrder = useSelector((state: RootState) => state.order.tempOrder);
  const checkoutItems = useSelector(selectCheckoutItems) as CheckoutOrderItem[];
  const userProfile = useSelector((state: RootState) => state.user.user);

  const tempOrderItems = tempOrder.items.map((item: CheckoutOrderItem) => ({
    item_id: item.item_id,
    item_type: item.item_type,
    quantity: item.quantity,
    price: item.price,
    service_type: item.service_type,
    name: item.name,
    image: item.image,
    product: item.item_type === "product" ? item.product : undefined,
    service: item.item_type === "service" ? item.service : undefined,
  }));

  const orderItems = source === "direct" ? tempOrderItems : checkoutItems;

  const [addressType, setAddressType] = useState<"saved" | "temp">("saved");
  const [tempAddress, setTempAddress] = useState<TempAddress>({
    full_name: userProfile?.full_name || "",
    phone_number: userProfile?.phone_number || "",
    address: "",
    ward: "",
    district: "",
    province: "",
    user_id: userProfile?.id || "",
    address_type: "others",
    is_default: false,
    is_temporary: true,
  });

  const isTempAddressValid = () => {
    if (addressType !== "temp") return true;

    // Validate required fields
    const requiredFields = [
      "full_name",
      "phone_number",
      "province",
      "district",
      "ward",
      "address",
    ];

    const hasAllRequiredFields = requiredFields.every(
      (field) =>
        tempAddress[field as keyof TempAddress]?.toString().trim() !== ""
    );

    // Validate field lengths and formats
    const isValidPhoneNumber = /^[0-9]{10}$/.test(tempAddress.phone_number);
    const isValidName = tempAddress.full_name.length >= 2;
    const isValidAddress = tempAddress.address.length >= 5;
    const isValidProvince = tempAddress.province.length >= 2;
    const isValidDistrict = tempAddress.district.length >= 2;
    const isValidWard = tempAddress.ward.length >= 2;

    return (
      hasAllRequiredFields &&
      isValidPhoneNumber &&
      isValidName &&
      isValidAddress
    );
  };

  const calculateTotalPrice = () => {
    if (!orderItems || orderItems.length === 0) return 0;

    return orderItems.reduce((total: number, item: CheckoutOrderItem) => {
      return total + item.price * item.quantity;
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

  const [isLoading, setIsLoading] = useState(false);

  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handlePaymentSelect = async (payment: PaymentMethod) => {
    await Haptics.selectionAsync();
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

  const handleVoucherSelect = (voucher: Voucher | null) => {
    setSelectedVoucher(voucher);
    if (voucher) {
      const newPrice = calculateDiscountedPrice(totalPrice, voucher);
      setDiscountedPrice(newPrice);
    } else {
      setDiscountedPrice(totalPrice);
    }
  };

  const reduxSelectedAddress = useSelector(
    (state: RootState) => state.address.selectedAddress
  );

  const loadSelectedAddress = async () => {
    try {
      const addresses = await dispatch(fetchAddresses()).unwrap();
      if (addresses && addresses.length > 0) {
        const defaultAddress =
          addresses.find((addr: Address) => addr.is_default) || addresses[0];
        if (defaultAddress) {
          setSelectedAddress(defaultAddress);
          dispatch(setReduxSelectedAddress(defaultAddress));
          await AsyncStorage.setItem(
            "selectedAddress",
            JSON.stringify(defaultAddress)
          );
        }
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to load addresses";
      showDialog(t("common.error"), errorMessage, "error");
    }
  };

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        if (!userProfile) return;

        try {
          const addresses = await dispatch(fetchAddresses()).unwrap();
          if (addresses && addresses.length > 0) {
            const defaultAddress =
              addresses.find((addr: Address) => addr.is_default) ||
              addresses[0];
            if (defaultAddress) {
              setSelectedAddress(defaultAddress);
              dispatch(setReduxSelectedAddress(defaultAddress));
            }
          }
        } catch (addressError) {
          console.error("Error loading addresses:", addressError);
        }

        try {
          await loadVouchers();
        } catch (voucherError) {
          console.error("Error loading vouchers:", voucherError);
        }
      } catch (error) {
        console.error("Error initializing checkout:", error);
      }
    };

    initializeCheckout();
  }, [userProfile]);

  useEffect(() => {
    if (reduxSelectedAddress) {
      setSelectedAddress(reduxSelectedAddress);
      setAddressType("saved");
    }
  }, [reduxSelectedAddress]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadSelectedAddress();
    });

    return unsubscribe;
  }, [navigation]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);

      // Validate địa chỉ
      if (addressType === "saved" && !selectedAddress) {
        showDialog(
          t("checkout.address_required_title"),
          t("checkout.address_required_message"),
          "warning"
        );
        return;
      }

      if (addressType === "temp" && !isTempAddressValid()) {
        console.log("Temp address:", tempAddress);
        showDialog(
          t("checkout.address_required_title"),
          t("checkout.temp_address_invalid"),
          "warning"
        );
        return;
      }

      // Tính toán số tiền giảm giá
      const discountAmount = selectedVoucher ? totalPrice - discountedPrice : 0;

      // Chuẩn bị dữ liệu đơn hàng
      const orderData: OrderRequest = {
        payment_method_id: selectedPayment.id,
        total_amount: totalPrice,
        discount_amount: discountAmount,
        order_items: orderItems.map((item: CheckoutOrderItem) => ({
          item_id: item.item_id,
          item_type: item.item_type,
          quantity: item.quantity,
          price: item.price,
          ...(item.item_type === "service" && {
            service_type: item.service_type || "single",
          }),
        })),
        note: note || undefined,
      };

      // Thêm thông tin địa chỉ dựa vào loại được chọn
      if (addressType === "saved" && selectedAddress) {
        orderData.shipping_address_id = Number(selectedAddress.id);
      } else if (addressType === "temp") {
        orderData.temporary_address = {
          full_name: tempAddress.full_name,
          phone_number: tempAddress.phone_number,
          province: tempAddress.province,
          district: tempAddress.district,
          ward: tempAddress.ward,
          address: tempAddress.address,
        };
      }

      // Thêm voucher nếu có
      if (selectedVoucher) {
        orderData.voucher_id = selectedVoucher.id;
      }

      console.log("Order Data:", JSON.stringify(orderData, null, 2)); // Log để debug

      // Gọi API tạo đơn hàng
      const orderResponse = await OrderService.createOrder(orderData);

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || "Failed to create order");
      }

      const { id: orderId, total_amount: serverCalculatedAmount } =
        orderResponse.data;

      // Xử lý thanh toán dựa trên phương thức được chọn
      if (selectedPayment.id === 1) {
        // Tiền mặt
        router.replace({
          pathname: "/(app)/invoice/success",
          params: {
            order_id: orderId,
            amount: serverCalculatedAmount.toString(),
            payment_time: new Date().toISOString(),
            payment_method: "cash",
          },
        });
      } else if (selectedPayment.id === 3) {
        // Chuyển khoản
        const returnUrl = Linking.createURL("/invoice/success", {
          queryParams: {
            order_id: orderId,
            amount: serverCalculatedAmount.toString(),
            payment_time: new Date().toISOString(),
            payment_method: "bank_transfer"
          }
        });

        const cancelUrl = Linking.createURL("/invoice/failed", {
          queryParams: {
            order_id: orderId,
            type: "cancel",
            payment_method: "bank_transfer",
            reason: t("invoice.payment_cancel_message")
          }
        });

        const paymentResponse = await OrderService.processPayment(orderId, {
          returnUrl,
          cancelUrl,
        });

        if (paymentResponse.success && paymentResponse.data?.checkoutUrl) {
          await Linking.openURL(paymentResponse.data.checkoutUrl);
        } else {
          router.replace({
            pathname: "/(app)/invoice/failed",
            params: {
              order_id: orderId,
              type: "failed",
              payment_method: "bank_transfer",
              reason: t("invoice.payment_failed_message")
            }
          });
        }
      }

      // Clear giỏ hàng nếu đặt hàng từ giỏ hàng
      if (source !== "direct") {
        dispatch(clearCart());
      }
      dispatch(clearTempOrder());
    } catch (error: any) {
      console.error("Payment error:", error);
      showDialog(
        t("common.error"),
        error.message || t("checkout.create_order_failed_message"),
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const [isLoadingVouchers, setIsLoadingVouchers] = useState(false);

  const loadVouchers = async () => {
    try {
      setIsLoadingVouchers(true);
      const vouchersResponse = await dispatch(getAllVouchersThunk()).unwrap();
      if (vouchersResponse) {
        const activeVouchers = vouchersResponse.filter(
          (v: Voucher) => v.is_active && v.remaining_uses > 0
        );
        setactiveVoucher(activeVouchers);
      }
    } catch (error) {
      console.error("Error loading vouchers:", error);
    } finally {
      setIsLoadingVouchers(false);
    }
  };

  useEffect(() => {
    setDiscountedPrice(totalPrice);
  }, [totalPrice]);

  useEffect(() => {
    if (source === "direct" && tempOrder.items.length === 0) {
      router.back();
      return;
    }
    if (source !== "direct" && checkoutItems.length === 0) {
      router.back();
      return;
    }

    const initialTotal = calculateTotalPrice();
    setTotalPrice(initialTotal);
    setDiscountedPrice(initialTotal);

    return () => {
      if (source === "direct") {
        dispatch(clearTempOrder());
      }
    };
  }, [source, tempOrder.items, checkoutItems]);

  const renderAddressSection = () => {
    const addressToShow = selectedAddress || reduxSelectedAddress;

    return (
      <View style={presets.section}>
        <Text text70 bold marginB-12>
          {t("checkout.select_address")}
        </Text>
        <PaymentAddress
          isPayment={true}
          onPress={() => router.push("/(app)/address")}
          selectAddress={addressToShow}
          addressType={addressType}
          setAddressType={setAddressType}
          tempAddress={tempAddress}
          setTempAddress={
            setTempAddress as React.Dispatch<React.SetStateAction<TempAddress>>
          }
          showDialog={showDialog}
          userProfile={userProfile}
        />
      </View>
    );
  };

  const renderPaymentMethodSection = () => (
    <View style={presets.section}>
      <Text text70 bold marginB-12>
        {t("checkout.payment_method")}
      </Text>
      <PaymentPicker
        value={selectedPayment}
        items={paymentMethods}
        onSelect={handlePaymentSelect}
      />
    </View>
  );

  const renderOrderItems = () => (
    <View style={presets.section}>
      <Text text70 bold marginB-12>
        {t("checkout.order_summary")}
      </Text>
      <View
        backgroundColor={Colors.white}
        br10
        style={{
          borderWidth: 1,
          borderColor: Colors.border,
        }}
      >
        {orderItems.map((item: CheckoutOrderItem, index: number) => (
          <View key={`${item.item_type}-${item.item_id}`}>
            <PaymentItem orderItem={item} />
            {index !== orderItems.length - 1 && (
              <View height-1 backgroundColor={Colors.border} marginH-15 />
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const isFormValid = () => {
    if (addressType === "saved" && !selectedAddress) {
      return false;
    }

    if (addressType === "temp" && !isTempAddressValid()) {
      return false;
    }

    if (!selectedPayment) {
      return false;
    }

    return orderItems.length > 0;
  };

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["20%"], []);

  const renderVoucherSection = () => (
    <View marginB-16>
      <Text text70 bold marginB-12>
        {t("checkout.voucher")}
      </Text>
      <VoucherDropdown
        value={selectedVoucher}
        items={activeVouchers}
        onSelect={handleVoucherSelect}
        isLoading={isLoadingVouchers}
      />
    </View>
  );

  const renderBottomSheet = () => (
    <BottomSheet
      ref={bottomSheetRef}
      snapPoints={snapPoints}
      enablePanDownToClose={false}
      style={[
        styles.bottomContainer,
        { borderTopLeftRadius: 24, borderTopRightRadius: 24 },
      ]}
    >
      <BottomSheetView style={styles.summaryContainer}>
        {renderVoucherSection()}
        <View style={styles.priceRow}>
          <Text style={styles.priceLabel}>{t("checkout.subtotal")}</Text>
          <Text style={styles.priceValue}>
            {formatCurrency({ price: totalPrice })}
          </Text>
        </View>

        {selectedVoucher && (
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>{t("orders.discount")}</Text>
            <Text style={styles.discountValue}>
              -{formatCurrency({ price: totalPrice - discountedPrice })}
            </Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>{t("checkout.total_payment")}</Text>
          <Text style={styles.totalValue}>
            {formatCurrency({ price: discountedPrice })}
          </Text>
        </View>

        <AppButton
          title={t("checkout.proceed_to_payment")}
          disabled={isLoading || !isFormValid()}
          onPress={handlePayment}
          type={"primary"}
        />
      </BottomSheetView>
    </BottomSheet>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <View flex bg-white>
          <AppBar back title={t("checkout.title")} />
          <KeyboardAwareScrollView
            contentContainerStyle={{ paddingBottom: 200 }}
          >
            <View flex paddingH-20 backgroundColor={Colors.white}>
              {renderAddressSection()}
              {renderPaymentMethodSection()}
              {renderOrderItems()}
            </View>
          </KeyboardAwareScrollView>
          {renderBottomSheet()}
          <AppDialog {...dialogConfig} onClose={hideDialog} />
        </View>
      </Animated.View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  bottomContainer: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    backgroundColor: Colors.white,
  },
  summaryContainer: {
    padding: 20,
    backgroundColor: Colors.white,
    transform: [{ translateY: 0 }],
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.grey30,
    fontWeight: "500",
  },
  priceValue: {
    fontSize: 14,
    color: Colors.grey10,
    fontWeight: "600",
  },
  discountValue: {
    fontSize: 14,
    color: Colors.red30,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: Colors.grey60,
    marginVertical: 16,
    opacity: 0.3,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.grey10,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  paymentButton: {
    height: 52,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    marginTop: 8,
  },
  paymentButtonLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  validInput: {
    borderColor: Colors.green30,
  },
  invalidInput: {
    borderColor: Colors.red30,
  },
});
