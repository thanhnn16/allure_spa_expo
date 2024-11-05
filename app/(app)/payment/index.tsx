import {
  SafeAreaView,
  StyleSheet,
  Image,
  ScrollView,
  Modal,
  ViewStyle,
} from "react-native";
import {
  View,
  Text,
  Button,
  Colors,
  Incubator,
  Card,
  TouchableOpacity,
} from "react-native-ui-lib";
import { Link, router, useLocalSearchParams } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useEffect } from "react";
import OrderService from "@/services/OrderService";
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { WebViewType } from "@/utils/constants/webview";
import LoadingOverlay from "@/components/loading/LoadingOverlay";
import { useDialog } from "@/hooks/useDialog";
import AppDialog from "@/components/dialog/AppDialog";

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
  icon: any;
}

// Thêm interface cho response
interface OrderResponse {
  id: string;
  order: {
    id: number;
    total_amount: number;
    status: string;
  };
  status: string;
}

export default function Payment() {
  const params = useLocalSearchParams();
  const { user } = useAuth();
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(
    null
  );
  const [products, setProducts] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const { showDialog, dialogConfig, hideDialog } = useDialog();

  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      name: "Thanh toán khi nhận hàng",
      code: "cod",
      icon: require("@/assets/images/cod.png"),
    },
    {
      id: 2,
      name: "Chuyển khoản ngân hàng",
      code: "bank_transfer",
      icon: require("@/assets/images/visa.png"),
    },
  ];

  useEffect(() => {
    if (params.products) {
      const parsedProducts = JSON.parse(params.products as string);
      setProducts(parsedProducts);
      setTotalAmount(Number(params.total_amount));
    }
  }, [params]);

  const handlePaymentSelect = (method: PaymentMethod) => {
    setSelectedPayment(method);
    setModalVisible(false);
  };

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

      const orderData = {
        user_id: user?.id!,
        payment_method_id: selectedPayment.id,
        total_amount: totalAmount,
        discount_amount: 0,
        voucher_id: null,
        order_items: products.map((item) => ({
          item_type: item.type as "product" | "service",
          item_id: item.id,
          service_type: item.service_type as
            | "single"
            | "combo_5"
            | "combo_10"
            | undefined,
          quantity: item.quantity,
          price: item.price,
        })),
      };

      const response = await OrderService.createOrder(orderData);

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

        const paymentResponse = await OrderService.createPaymentLink({
          invoice_id: response.id,
          returnUrl: `${Constants.expoConfig?.extra?.EXPO_PUBLIC_APP_URL}/payment/success`,
          cancelUrl: `${Constants.expoConfig?.extra?.EXPO_PUBLIC_APP_URL}/payment/cancel`,
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
        error.message || "Không thể xử lý thanh toán",
        "error"
      );
    } finally {
      setLoading(false);
      setLoadingMessage("");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.productListContainer,
          { backgroundColor: "#FFFFFF" },
        ]}
      >
        <View style={styles.sectionNoBorder}>
          <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
          <Card>
            <TouchableOpacity
              onPress={() => console.log("Cập nhật sau")}
              style={[styles.customerInfoCard, { backgroundColor: "#f8f8f8" }]}
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
            onPress={() => setModalVisible(true)}
            style={styles.paymentSelector}
          >
            <Text>
              {selectedPayment?.name || "Chọn phương thức thanh toán"}
            </Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={isModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalTitleContainer}>
                <Text style={styles.modalTitle}>
                  Chọn phương thức thanh toán
                </Text>
              </View>
              <View
                style={[
                  styles.productDivider,
                  { height: 1, backgroundColor: "#E0E0E0" },
                ]}
              />
              {paymentMethods.map((method) => (
                <TouchableOpacity
                  key={method.id}
                  style={styles.paymentOption}
                  onPress={() => handlePaymentSelect(method)}
                >
                  <View style={styles.optionLeft}>
                    <View style={styles.paymentIconContainer}>
                      <Image source={method.icon} style={styles.paymentIcon} />
                    </View>
                  </View>
                  {selectedPayment?.id === method.id && (
                    <View style={styles.checkIconContainer}>
                      <Ionicons
                        name="checkmark"
                        size={14}
                        style={styles.checkIcon}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              ))}

              <Button
                label="Tiếp tục"
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
                onPress={() => setModalVisible(false)}
              />
            </View>
          </TouchableOpacity>
        </Modal>

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
              2.385.000 VNĐ
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

      <LoadingOverlay message={loadingMessage} />

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
    width: 330,
    height: 65,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginTop: 5,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  selectedOption: {
    backgroundColor: Colors.grey70,
  },
  checkIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  checkIcon: {
    color: Colors.primary,
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

const products: Product[] = [
  {
    id: 1,
    name: "Lamellar Lipocollage",
    price: "1.170.000 VNĐ",
    quantity: 1,
    image: require("@/assets/images/sp2.png"),
  },
  {
    id: 2,
    name: "Lamellar Lipocollage",
    price: "1.170.000 VNĐ",
    quantity: 1,
    image: require("@/assets/images/sp2.png"),
  },
];

const modalOverlay: ViewStyle = {
  flex: 1,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  justifyContent: "flex-end",
};

const updatedStyles = StyleSheet.create({
  ...styles,
  modalOverlay,
});

Object.assign(styles, updatedStyles);

const modalDivider: ViewStyle = {
  width: "100%",
  height: 1,
  backgroundColor: "#E0E0E0",
  marginBottom: 25,
};

const updatedStylesWithDivider = StyleSheet.create({
  ...updatedStyles,
  modalDivider,
});

Object.assign(styles, updatedStylesWithDivider);
