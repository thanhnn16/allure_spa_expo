import AppBar from "@/components/app-bar/AppBar";
import AppDialog from "@/components/dialog/AppDialog";
import LoadingOverlay from "@/components/loading/LoadingOverlay";
import PaymentAddress from "@/components/payment/PaymentAddress";
import PaymentHeader from "@/components/payment/PaymentAddress";
import PaymentMethodSelect from "@/components/payment/PaymentMethodSelect";
import PaymentProductItem from "@/components/payment/PaymentProductItem";
import { useAuth } from "@/hooks/useAuth";
import { useDialog } from "@/hooks/useDialog";
import OrderService from "@/services/OrderService";
import { WebViewType } from "@/utils/constants/webview";
import {
  Ionicons as ExpoIonicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, ScrollView, StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Card,
  Colors,
  Incubator,
  Text,
  TouchableOpacity,
  View,
} from "react-native-ui-lib";

export interface PaymentProduct {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: any;
}

export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  icon: string;
  iconType: "Ionicons" | "MaterialCommunityIcons";
}

export default function Payment() {
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
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      name: "Thanh toán khi nhận hàng",
      code: "cod",
      icon: "cash",
      iconType: "Ionicons",
    },
    {
      id: 2,
      name: "Chuyển khoản ngân hàng",
      code: "bank_transfer",
      icon: "bank",
      iconType: "MaterialCommunityIcons",
    },
  ];

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%"], []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      setShowBottomSheet(false);
    }
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        pressBehavior="close"
      />
    ),
    []
  );

  useEffect(() => {
    if (showBottomSheet) {
      bottomSheetRef.current?.expand();
    } else {
      bottomSheetRef.current?.close();
    }
  }, [showBottomSheet]);

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

      const invoiceResponse = await OrderService.createInvoice(invoiceData);

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
          const paymentResponse = await OrderService.createPaymentLink({
            invoice_id: invoice.id,
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

  const handleSelectPayment = (payment: PaymentMethod) => {
    setSelectedPayment(payment);
    setShowBottomSheet(false);
  };

  const renderPaymentMethods = () => {
    return (
      <BottomSheetView>
        <View flex padding-16>
          {paymentMethods.map((method) => (
            <TouchableOpacity
              key={method.id}
              onPress={() => handleSelectPayment(method)}
              style={[
                styles.paymentOption,
                selectedPayment?.id === method.id && styles.selectedOption,
              ]}
            >
              <View row spread centerV>
                <View row centerV>
                  {method.iconType === "Ionicons" ? (
                    <ExpoIonicons
                      name={method.icon as any}
                      size={24}
                      color={Colors.grey10}
                    />
                  ) : (
                    <MaterialCommunityIcons
                      name={method.icon as any}
                      size={24}
                      color={Colors.grey10}
                    />
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
      </BottomSheetView>
    );
  };

  useEffect(() => {
    return () => {
      setLoading(false);
      setLoadingMessage("");
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
        <AppBar back title="Thanh toán" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.productListContainer}
        >
          <PaymentAddress isPayment />

          <View gap-10 marginB-20>
            <Text h2_bold>Voucher</Text>
            <View
              row paddingH-15 paddingV-20 centerV spread
              style={{
                borderWidth: 1,
                borderColor: "#E0E0E0",
                borderRadius: 10,
                backgroundColor: "#FCFCFC",
              }}
            >
              <Text h3>Chưa có voucher</Text>
              <Ionicons
                name="chevron-down"
                size={24}
                color={Colors.grey30}
              />
            </View>
          </View>

          <PaymentMethodSelect
            isPayment
            onPress={() => setShowBottomSheet(true)}
            selectedPayment={selectedPayment}
          />

          <View gap-10>
            <Text h2_bold>Sản phẩm</Text>
            {products.map((product: PaymentProduct) => (
              <PaymentProductItem key={product.id} product={product} />
            ))}
          </View>



        </ScrollView>

        <View paddingH-20
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
            paddingTop: 10,
          }}
        >
          <View gap-10 marginB-5>
            <View row spread>
              <Text h3_bold >Voucher</Text>
              <Text h3>Không có</Text>
            </View>
            <View row spread>
              <Text h3_bold>Tổng thanh toán</Text>
              <Text h3_bold secondary>
                {totalAmount.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
          </View>

          <Button
            label="Thanh toán"
            labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
            backgroundColor={Colors.primary}
            padding-20
            borderRadius={10}
            style={{
              width: '100%',
              height: 50,
              alignSelf: "center",
              marginVertical: 10,
            }}
            onPress={handleCheckout}
            disabled={loading}
          />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onChange={handleSheetChanges}
          backdropComponent={renderBackdrop}
          backgroundStyle={styles.bottomSheet}
        >
          <View style={styles.bottomSheetHeader}>
            <Text text60BO>Chọn phương thức thanh toán</Text>
            <TouchableOpacity onPress={() => setShowBottomSheet(false)}>
              <ExpoIonicons name="close" size={24} color={Colors.grey30} />
            </TouchableOpacity>
          </View>
          <View flex>{renderPaymentMethods()}</View>
        </BottomSheet>

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
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  section: {
    backgroundColor: "#FFFFFF",
    padding: 10,
    paddingHorizontal: 20,
    marginTop: -15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    alignItems: "center",
  },
  totalSection: {
    padding: 16,
    paddingHorizontal: 20,
    backgroundColor: "#f8f8f8",
    marginHorizontal: 20,
    borderRadius: 8,
  },
  productCard: {
    marginVertical: 8,
    width: "100%",
    height: 91.03,
    paddingRight: 10,
    backgroundColor: "transparent",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  productImage: {
    width: 96,
    height: 89,
    borderRadius: 10,
  },
  customerInfoCard: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    justifyContent: "space-between",
  },
  customerInfo: {
    flex: 1,
  },
  arrowIcon: {
    width: 24,
    height: 24,
    transform: [{ rotate: "180deg" }],
    tintColor: "black",
  },
  inputField: {
    width: 335,
    height: 44,
    borderWidth: 0,
    padding: 8,
    borderRadius: 8,
  },
  textFieldContainer: {
    padding: 10,
    width: "100%",
  },
  placeholderStyle: {
    color: "#000000",
    fontWeight: "500",
    fontSize: 14,
    marginLeft: 0,
  },
  productInfo: {
    marginLeft: 12,
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  categoryText: {
    color: "#B0ACAC",
  },
  productDetails: {
    marginLeft: "auto",
  },
  quantityText: {
    marginTop: 4,
    color: "#666666",
  },
  productDivider: {
    width: "100%",
    height: 1,
    backgroundColor: "rgba(176, 172, 172, 0.5)",
    marginVertical: 8,
  },
  paymentSelector: {
    width: "100%",
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 0,
    marginHorizontal: 0,
    borderRadius: 8,
  },
  icon: {
    fontSize: 20,
    color: "gray",
    marginRight: 10,
  },
  modalContent: {
    width: "100%",
    height: 413,
    backgroundColor: "#fff",
    paddingTop: 20,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  modalTitleContainer: {
    width: "100%",
    alignItems: "flex-start",
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  paymentIconContainer: {
    width: 90,
    height: 38,
    justifyContent: "center",
  },
  paymentIcon: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  paymentOption: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey60,
  },
  selectedOption: {
    backgroundColor: Colors.grey70,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  paymentMethodName: {
    fontSize: 16,
    marginLeft: 8,
  },
  selectedPaymentContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  placeholderText: {
    color: Colors.grey30,
    fontSize: 16,
  },
  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 20,
    elevation: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  bottomSheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey60,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  productListContainer: {
    flexGrow: 1,
    paddingBottom: 10,
    paddingHorizontal: 20
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  productCardGrid: {
    width: "48%",
    marginBottom: 15,
    height: 200,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionNoBorder: {
    backgroundColor: "#FFFFFF",
    padding: 15,
    paddingHorizontal: 20,
  },
  sectionDarkBorder: {
    padding: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
    marginHorizontal: 20,
  },
  borderInset: {
    width: 370,
    height: 2,
    backgroundColor: "#717658",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10,
  },
});
