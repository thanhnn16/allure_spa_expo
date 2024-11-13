import { useState, useEffect } from "react";
import {
  StyleSheet,
  ScrollView,
  ImageSourcePropType,
  SafeAreaView,
  Alert,
} from "react-native";
import { Button, Colors, Text, View } from "react-native-ui-lib";
import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import PaymentAddress from "@/components/payment/PaymentAddress";
import VoucherDropdown from "@/components/payment/VoucherDropdown";
import PaymentPicker from "@/components/payment/PaymentPicker";
import PaymentProductItem from "@/components/payment/PaymentProductItem";
import i18n from "@/languages/i18n";
import formatCurrency from "@/utils/price/formatCurrency";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { clearOrder, OrderProduct } from "@/redux/features/order/orderSlice";
import { Voucher } from "@/types/voucher.type";
import { getAllVouchersThunk } from "@/redux/features/voucher/getAllVoucherThunk";
import { set } from "lodash";
import AppDialog from "@/components/dialog/AppDialog";
import { WebViewType } from "@/utils/constants/webview";
import axios from "axios";
import Constants from "expo-constants";
import OrderService from "@/services/OrderService";
import { useAuth } from "@/hooks/useAuth";

export interface PaymentAddressProps {
  fullName: string;
  phoneNumber: string;
  fullAddress: string;
  addressType: string;
  isDefault: string;
  note: string;
  addressId: string;
  province: string;
  district: string;
  address: string;
}

export interface PaymentMethod {
  id: number;
  name: string;
  icon?: ImageSourcePropType;
  iconName: string;
  code?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 0,
    name: "Thanh toán khi nhận hàng",
    iconName: "cash-outline",
  },
  {
    id: 1,
    name: "Thanh toán online",
    iconName: "card-outline",
  },
];



export default function Payment() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [selectedAddress, setSelectedAddress] = useState<PaymentAddressProps | null>(null);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);
  const [activeVouchers, setactiveVoucher] = useState<Voucher[]>([]);
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [paymentDialog, setPaymentDialog] = useState(false);

  const { products, totalAmount } = useSelector(
    (state: RootState) => state.order
  );
  const { vouchers, isLoading } = useSelector((
    state: RootState) => state.voucher
  );
  
  // Tính toán tổng giá dựa trên sản phẩm
  const calculateTotalPrice = () => {
    let total = 0;
    products.forEach((product: any) => {
      total += product.priceValue * product.quantity;
    });
    return total;
  };

  const calculateDiscountedPrice = (price: number, voucher: Voucher) => {
    let priceWithDiscount: number
    if (voucher && voucher.discount_type === 'percentage') {
      priceWithDiscount = price - (price * voucher.discount_value) / 100;
    } else {
      priceWithDiscount = price - voucher.discount_value;
    }
    return priceWithDiscount;
  };

  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice());
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);

  const handlePaymentSelect = (payment: PaymentMethod) => {
    setSelectedPayment(payment);
  };

  const handleVoucherSelect = (voucher: Voucher) => {
    setVoucher(voucher);
    setSelectedVoucher(voucher);
    const newPrice = calculateDiscountedPrice(
      totalPrice,
      voucher
    );
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
      const scheme = __DEV__ ? "exp+allurespa" : "allurespa";

      const invoiceData = {
        payment_method_id: selectedPayment.id,
        total_amount: totalAmount,
        discount_amount: 0,
        voucher_id: voucher?.id || null,
        order_items: products.map((item: any) => ({
          item_type: item.type || "product",
          item_id: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
      };
      console.log("Invoice data:", invoiceData);

      const orderResponse = await OrderService.createOrder(invoiceData);
      const orderId = orderResponse.data.id;
      console.log("Order created:", orderResponse);

      const paymentData = {
        returnUrl: `${scheme}://transaction?status=success`,
        cancelUrl: `${scheme}://transaction?status=cancel`,
      };
      const paymentResponse = await OrderService.processPayment(orderId, paymentData);

      if (paymentResponse.success) {
        // Navigate to the payment URL or show the QR code
        if (paymentResponse.data?.checkoutUrl) {
          router.push({
            pathname: "/webview",
            params: {
              url: paymentResponse.data.checkoutUrl,
              type: WebViewType.PAYMENT,
            },
          });
        } else if (paymentResponse.data?.qrCode) {
          Alert.alert("QR Code", paymentResponse.data.qrCode);
        }
      } else {
        Alert.alert("Error", paymentResponse.message || "Không thể tạo link thanh toán");
      }

    } catch (error: any) {
      console.error("Payment Error:", {
        message: error.message,
        response: error.response?.data,
      });

      setPaymentDialog(false)
    }
  };

  useEffect(() => {
    const fetchVouchers = async () => {
      try {
        await dispatch(getAllVouchersThunk());
        setactiveVoucher(vouchers.filter((voucher: any) => voucher.is_active));
      } catch (error) {
        console.error('Error fetching vouchers:', error);
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
    if (!products.length) {
      router.back();
      return;
    }

    setTotalPrice(totalAmount);
    setDiscountedPrice(totalAmount);

    return () => {
      dispatch(clearOrder());
    };
  }, [products, totalAmount, dispatch]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AppBar back title={i18n.t("checkout.title")} />
      <View flex backgroundColor={Colors.white}>
        <ScrollView style={{ paddingHorizontal: 20 }} showsVerticalScrollIndicator={false}>
          <PaymentAddress
            isPayment
            onPress={() => router.push('/(app)/address')}
            selectAddress={selectedAddress}
          />

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
            {products.map((product: OrderProduct) => (
              <PaymentProductItem
                key={product.id}
                product={product}
              />
            ))}
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
            <View row centerV spread >
              <Text h3_bold>{i18n.t("checkout.subtotal")}</Text>
              <Text h3_bold>
                {formatCurrency({ price: totalPrice })}
              </Text>
            </View>
            <View row centerV spread marginT-10>
              <Text h3_bold>{i18n.t("checkout.voucher")}</Text>
              <Text h3>{selectedVoucher ? selectedVoucher.code : ''}</Text>
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
          description={"Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng không?"}
          closeButtonLabel={i18n.t("common.cancel")}
          confirmButtonLabel={"Xóa"}
          severity="info"
          onClose={() => setPaymentDialog(false)}
        />
      </View>
    </SafeAreaView>
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
  }
});