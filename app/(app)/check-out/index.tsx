import AppBar from "@/components/app-bar/AppBar";
import AppDialog from "@/components/dialog/AppDialog";
import LoadingOverlay from "@/components/loading/LoadingOverlay";
import PaymentAddress from "@/components/payment/PaymentAddress";
import PaymentMethodSelect from "@/components/payment/PaymentMethodSelect";
import PaymentProductItem from "@/components/payment/PaymentProductItem";
import { useAuth } from "@/hooks/useAuth";
import { useDialog } from "@/hooks/useDialog";
import OrderService from "@/services/OrderService";
import { Product } from "@/types/product.type";
import { WebViewType } from "@/utils/constants/webview";
import {
  Ionicons as ExpoIonicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ExpandableSection } from "react-native-ui-lib";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, ImageSourcePropType } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  Button,
  Colors,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";
import AppButton from "@/components/buttons/AppButton";

export interface PaymentProduct {
  id: number;
  name: string;
  price: string;
  priceValue: number;
  quantity: number;
  image: any;
}

interface Voucher {
  label: string;
  value: string;
  discountPercentage: number;
}

interface PaymentMethod {
  id: number;
  name: string;
  icon?: ImageSourcePropType;
  iconType?: "MaterialCommunityIcons" | "MaterialIcons";
  iconName?: string;
  code?: string;
  children?: PaymentMethod[];
}

const calculateTotalPrice = (products: Product[]) => {
  return products.reduce((total, product) => {
    return total + Number(product.price) * product.quantity;
  }, 0);
};

export default function Checkout() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    null
  );
  const [products, setProducts] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { showDialog, dialogConfig, hideDialog } = useDialog();
  const [selectedVoucher, setSelectedVoucher] = useState("Không có");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [totalPrice, setTotalPrice] = useState(() =>
    calculateTotalPrice(products)
  );
  const [discountedPrice, setDiscountedPrice] = useState(totalPrice);
  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      name: "Thanh toán khi nhận hàng",
      iconType: "MaterialCommunityIcons",
      iconName: "cash",
      children: [],
    },
    {
      id: 2,
      name: "Thanh toán online",
      iconType: "MaterialIcons",
      iconName: "credit-card",
      children: [
        {
          id: 21,
          name: "VISA / MasterCard",
          icon: require("@/assets/images/visa.png"),
        },
        {
          id: 22,
          name: "ZaloPay",
          icon: require("@/assets/images/zalopay.png"),
        },
        {
          id: 23,
          name: "Apple Pay",
          icon: require("@/assets/images/apple.png"),
        },
      ],
    },
  ];

  useEffect(() => {
    if (params.products) {
      try {
        const parsedProducts = JSON.parse(params.products as string);
        setProducts(parsedProducts);

        const total = parsedProducts.reduce((sum: number, product: any) => {
          return sum + Number(product.price) * product.quantity;
        }, 0);

        setTotalAmount(total);
      } catch (error) {
        console.error("Error parsing products:", error);
        router.back();
      }
    }
  }, []);

  const handleCheckout = async () => {
    if (!selectedPayment) {
      showDialog(
        "Thông báo",
        "Vui lòng chọn phương thức thanh toán",
        "warning"
      );
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage("Đang tạo đơn hàng...");

      const invoiceData = {
        user_id: user?.id!,
        payment_method_id: selectedPayment.id,
        total_amount: totalAmount,
        discount_amount: 0,
        voucher_id: null,
        order_items: products.map((item) => ({
          item_type: item.type || "product",
          item_id: item.id,
          service_type: item.service_type,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const invoiceResponse = await OrderService.createOrder(invoiceData);

      if (!invoiceResponse.success || !invoiceResponse.data?.id) {
        throw new Error(invoiceResponse.message || "Không thể tạo hóa đơn");
      }

      const invoice = invoiceResponse.data;

      if (selectedPayment.code === "cod") {
        router.push({
          pathname: "/(app)/transaction",
          params: {
            invoice_id: invoice.id,
            order_id: invoice.order.id.toString(),
            payment_status: "pending",
            payment_method: "cod",
          },
        });
      } else {
        setLoadingMessage("Đang tạo link thanh toán...");

        const scheme = __DEV__ ? "exp+allurespa" : "allurespa";
        const returnUrl = `${scheme}://payment?status=success&invoice_id=${invoice.id}`;
        const cancelUrl = `${scheme}://payment?status=cancel&invoice_id=${invoice.id}`;

        try {
          const paymentResponse = await OrderService.createOrder({
            returnUrl,
            cancelUrl,
          });

          if (paymentResponse.success && paymentResponse.data?.checkoutUrl) {
            await AsyncStorage.setItem(
              "current_invoice_id",
              invoice.id.toString()
            );

            await AsyncStorage.setItem(
              "payment_data",
              JSON.stringify({
                invoice_id: invoice.id,
                order_id: invoice.order.id,
                amount: totalAmount,
                payment_method: selectedPayment.code,
                timestamp: new Date().toISOString(),
              })
            );

            router.push({
              pathname: "/webview",
              params: {
                url: paymentResponse.data.checkoutUrl,
                type: WebViewType.PAYMENT,
                invoice_id: invoice.id,
              },
            });
          } else {
            throw new Error(
              paymentResponse.message || "Không thể tạo link thanh toán"
            );
          }
        } catch (paymentError: any) {
          console.error("Payment link creation error:", paymentError);
          showDialog(
            "Lỗi Thanh Toán",
            paymentError.message ||
              "Không thể tạo link thanh toán. Vui lòng thử lại sau.",
            "error"
          );
        }
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      showDialog(
        "Lỗi Thanh Toán",
        error.response?.data?.message ||
          error.message ||
          "Không thể xử lý thanh toán",
        "error"
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const renderPaymentIcon = (method: PaymentMethod) => {
    if (method.iconType === "MaterialCommunityIcons" && method.iconName) {
      return (
        <MaterialCommunityIcons
          name={method.iconName as any}
          size={24}
          color="#000000"
        />
      );
    }
    if (method.iconType === "MaterialIcons" && method.iconName) {
      return (
        <MaterialIcons
          name={method.iconName as any}
          size={24}
          color="#000000"
        />
      );
    }
    if (method.icon) {
      return (
        <Image
          source={method.icon}
          width={24}
          height={24}
          resizeMode="contain"
        />
      );
    }
    return null;
  };

  const handleSelectPayment = (payment: PaymentMethod) => {
    setSelectedPayment(payment);
  };

  const renderPaymentMethods = () => {
    return (
      <View flex padding-16>
        {paymentMethods.map((method) => (
          <TouchableOpacity
            key={method.id}
            onPress={() => handleSelectPayment(method)}
            padding-12
            br20
            backgroundColor={
              selectedPayment?.id === method.id ? Colors.grey70 : undefined
            }
            border-b-1
          >
            <View row spread centerV>
              <View row centerV>
                {method.icon ? (
                  <Image
                    source={method.icon}
                    width={24}
                    height={24}
                    resizeMode="contain"
                  />
                ) : (
                  renderPaymentIcon(method)
                )}
                <Text marginL-8 text70>
                  {method.name}
                </Text>
              </View>
              {selectedPayment?.id === method.id && (
                <ExpoIonicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.primary}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  useEffect(() => {
    return () => {
      setLoading(false);
      setLoadingMessage("");
    };
  }, []);

  const calculateDiscountedPrice = (
    originalPrice: number,
    discountPercentage: number
  ) => {
    const discount = originalPrice * (discountPercentage / 100);
    return originalPrice - discount;
  };

  const handleVoucherSelect = (voucher: Voucher) => {
    setSelectedVoucher(voucher.label);
    const newPrice = calculateDiscountedPrice(
      totalPrice,
      voucher.discountPercentage
    );
    setDiscountedPrice(newPrice);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View flex bg-white>
        <AppBar back title="Thanh toán" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 10,
            paddingHorizontal: 20,
          }}
        >
          <PaymentAddress isPayment />

          <View gap-10 marginB-20>
            <Text h2_bold>Voucher</Text>
            <View
              row
              paddingH-15
              paddingV-20
              centerV
              spread
              br10
              border-1
              bg-grey70
            >
              <Text h3>Chưa có voucher</Text>
              <Ionicons name="chevron-down" size={24} color={Colors.grey30} />
            </View>
          </View>

          <ExpandableSection
            expanded={false}
            sectionHeader={
              <PaymentMethodSelect
                isPayment
                selectedPayment={selectedPayment}
              />
            }
          >
            {renderPaymentMethods()}
          </ExpandableSection>

          <View gap-10>
            <Text h2_bold>Sản phẩm</Text>
            {products.map((product: PaymentProduct) => (
              <PaymentProductItem key={product.id} product={product} />
            ))}
          </View>
        </ScrollView>

        <View
          paddingH-20
          bg-white
          border-1
          style={{
            borderBottomWidth: 0,
            borderTopLeftRadius: 13,
            borderTopRightRadius: 13,
          }}
          paddingT-10
        >
          <View gap-10 marginB-5>
            <View row spread>
              <Text h3_bold>Voucher</Text>
              <Text h3>Không có</Text>
            </View>
            <View row spread>
              <Text h3_bold>Tổng thanh toán</Text>
              <Text h3_bold secondary>
                {totalAmount.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
          </View>

          <AppButton
            title="Thanh toán"
            type="primary"
            disabled={loading}
            onPress={handleCheckout}
          />
        </View>

        <LoadingOverlay visible={loading} message={loadingMessage} />
        <AppDialog
          visible={dialogConfig.visible}
          title={dialogConfig.title}
          description={dialogConfig.description}
          severity={dialogConfig.severity}
          onClose={hideDialog}
          closeButton={true}
          confirmButton={false}
          closeButtonLabel="Đóng"
        />
      </View>
    </GestureHandlerRootView>
  );
}
