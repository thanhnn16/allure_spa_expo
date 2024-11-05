import AppDialog from "@/components/dialog/AppDialog";
import LoadingOverlay from "@/components/loading/LoadingOverlay";
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

interface Product {
  id: number;
  name: string;
  price: string;
  quantity: number;
  image: any;
}

interface PaymentMethod {
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

      const response = await OrderService.createInvoice(invoiceData);

      if (selectedPayment.code === "cod") {
        router.push({
          pathname: "/transaction/success",
          params: {
            invoice_id: response.id,
            order_id: response.order.id.toString(),
            payment_status: "pending",
            payment_method: "cod",
          },
        });
      } else {
        setLoadingMessage("Đang tạo link thanh toán...");

        const scheme = __DEV__ ? "exp+allurespa" : "allurespa";

        const paymentResponse = await OrderService.createPaymentLink({
          invoice_id: response.id,
          returnUrl: `${scheme}://payment?status=success&invoice_id=${response.id}`,
          cancelUrl: `${scheme}://payment?status=cancel&invoice_id=${response.id}`,
        });

        if (paymentResponse.success && paymentResponse.checkoutUrl) {
          await AsyncStorage.setItem("current_invoice_id", response.id);

          router.push({
            pathname: "/webview",
            params: {
              url: paymentResponse.checkoutUrl,
              type: WebViewType.PAYMENT,
              invoice_id: response.id,
            },
          });
        } else {
          throw new Error(
            paymentResponse.message || "Không thể tạo link thanh toán"
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
    if (method.iconType === "Ionicons") {
      return (
        <ExpoIonicons
          name={method.icon as any}
          size={24}
          color={Colors.primary}
        />
      );
    }
    return (
      <MaterialCommunityIcons
        name={method.icon as any}
        size={24}
        color={Colors.primary}
      />
    );
  };

  const handleSelectPayment = (payment: PaymentMethod) => {
    setSelectedPayment(payment);
    setShowBottomSheet(false);
  };

  const renderPaymentMethods = () => {
    return (
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
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Button
            iconSource={require("@/assets/images/home/arrow_ios.png")}
            onPress={() => router.back()}
            link
            iconStyle={{ tintColor: "black" }}
          />
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              fontSize: 18,
              fontWeight: "bold",
            }}
          >
            Thanh toán
          </Text>
        </View>

        <View flex>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.productListContainer}
          >
            <View style={styles.sectionNoBorder}>
              <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
              <Card>
                <TouchableOpacity
                  onPress={() => console.log("Cập nhật sau")}
                  style={[
                    styles.customerInfoCard,
                    { backgroundColor: "#f8f8f8" },
                  ]}
                >
                  <View style={styles.customerInfo}>
                    <Text style={{ fontSize: 14 }}>Lộc Nè Con</Text>
                    <Text style={{ fontSize: 14 }}>+84 123 456 789</Text>
                    <Text style={{ fontSize: 14 }}>
                      123 acb, phường Tân Thới Hiệp, Quận 12, TP.HCM
                    </Text>
                  </View>
                  <Image
                    source={require("@/assets/images/home/arrow_ios.png")}
                    style={styles.arrowIcon}
                  />
                </TouchableOpacity>
              </Card>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Voucher</Text>
              <Card>
                <View
                  style={[
                    styles.textFieldContainer,
                    { backgroundColor: "#f8f8f8" },
                  ]}
                >
                  <Incubator.TextField
                    placeholder="Không có"
                    value=""
                    editable={false}
                    style={[styles.inputField, styles.placeholderStyle]}
                    placeholderTextColor="#000000"
                  />
                </View>
              </Card>
              <View style={styles.borderInset} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Hình thức thanh toán</Text>
              <TouchableOpacity
                onPress={() => setShowBottomSheet(true)}
                style={styles.paymentSelector}
              >
                <View style={styles.selectedPaymentContent}>
                  {selectedPayment && (
                    <View style={styles.optionLeft}>
                      {renderPaymentIcon(selectedPayment)}
                      <Text style={styles.paymentMethodName}>
                        {selectedPayment.name}
                      </Text>
                    </View>
                  )}
                  {!selectedPayment && (
                    <Text style={styles.placeholderText}>
                      Chọn phương thức thanh toán
                    </Text>
                  )}
                  <Ionicons
                    name="chevron-down"
                    size={24}
                    color={Colors.grey30}
                  />
                </View>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sản phẩm</Text>
              {products.map((product: Product) => (
                <Card
                  key={product.id}
                  style={styles.productCard}
                  enableShadow={false}
                  backgroundColor="transparent"
                >
                  <View style={styles.cardRow}>
                    <Card.Image
                      source={product.image}
                      style={styles.productImage}
                    />
                    <View style={styles.productInfo}>
                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ fontWeight: "bold", fontSize: 15 }}>
                          {product.name}
                        </Text>
                      </View>

                      <View style={{ marginBottom: 8 }}>
                        <Text style={{ fontSize: 16 }}>{product.price}</Text>
                      </View>

                      <View style={styles.productRow}>
                        <Text style={{ fontSize: 12 }}>
                          Số lượng: {product.quantity}
                        </Text>
                        <Text style={[styles.categoryText, { fontSize: 12 }]}>
                          Dưỡng ẩm
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.productDivider} />
                </Card>
              ))}
            </View>

            <View style={styles.totalSection}>
              <View style={styles.row}>
                <Text style={{ fontWeight: "bold" }}>Voucher</Text>
                <Text>Không có</Text>
              </View>
              <View style={[styles.row, { marginTop: 8 }]}>
                <Text style={{ fontWeight: "bold" }}>Tổng thanh toán</Text>
                <Text style={{ fontWeight: "bold", color: Colors.red30 }}>
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
                width: 338,
                height: 47,
                alignSelf: "center",
                marginVertical: 10,
              }}
              onPress={handleCheckout}
              disabled={loading}
            />
            <Button
              label="Detail Transaction"
              labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
              backgroundColor={Colors.primary}
              padding-20
              borderRadius={10}
              style={{
                width: 338,
                height: 47,
                alignSelf: "center",
                marginVertical: 10,
              }}
              onPress={() => router.push("/transaction/detail")}
            />
          </ScrollView>

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
        </View>
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
