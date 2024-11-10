import { StyleSheet, FlatList, SafeAreaView, Image } from "react-native";
import { View, Text, Colors, Button } from "react-native-ui-lib";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WebViewType } from "@/utils/constants/webview";
import AppDialog from "@/components/dialog/AppDialog";
import { useState } from "react";
import Constants from "expo-constants";
interface Transaction {
  orderNumber: string;
  status: "cancelled" | "delivered" | "pending"; // Thêm trạng thái
  totalAmount?: number; // Thêm tổng tiền
  date?: string; // Thêm ngày tháng
}

const transactions: Transaction[] = [
  {
    orderNumber: "#acb122",
    status: "cancelled",
    totalAmount: 1170000,
    date: "26-08-2024",
  },
  {
    orderNumber: "#acb123",
    status: "delivered",
    totalAmount: 2170000,
    date: "27-08-2024",
  },
  {
    orderNumber: "#acb124",
    status: "pending",
    totalAmount: 3170000,
    date: "28-08-2024",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 15,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginRight: 24,
  },
  transactionItem: {
    height: 91.03,
    marginHorizontal: 20,
    marginTop: 15,
  },
  orderNumber: {
    fontSize: 16,
    color: "#717658",
    marginBottom: 8,
    fontWeight: "bold",
  },
  status: {
    fontSize: 15,
    letterSpacing: 0.5,
    flexShrink: 1,
    flexWrap: "wrap",
  },
  normalText: {
    color: "#000000",
    fontWeight: "bold",
  },
  orderCode: {
    color: "black",
  },
  cancelText: {
    color: Colors.red30,
    fontWeight: "bold",
  },
  deliveredText: {
    color: "#198745", // Màu xanh cho trạng thái thành công
    fontWeight: "bold",
  },
  pendingText: {
    color: "#BD7A3F", // Màu cam cho trạng thái tiếp nhận
    fontWeight: "bold",
  },
  amount: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
  },
  date: {
    fontSize: 14,
    color: "#666666",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute", // Đặt vị trí tuyệt đối
    bottom: 0, // Đặt ở dưới cùng của container
    left: 10,
    right: 0,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: "100%", // Để row chiếm hết chiều cao của item
  },
  productImage: {
    width: 90,
    height: 86,
    borderRadius: 8,
    marginRight: 12,
  },
  contentContainer: {
    flex: 1,
    height: "100%",
    justifyContent: "space-between",
    paddingRight: 16,
    flexShrink: 1,
  },
  statusContainer: {
    width: "100%",
    minHeight: 35,
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

const Transaction = () => {
  const getStatusText = (status: string) => {
    switch (status) {
      case "cancelled":
        return <Text style={styles.cancelText}>huỷ bỏ</Text>;
      case "delivered":
        return <Text style={styles.deliveredText}>thành công</Text>;
      case "pending":
        return <Text style={styles.pendingText}>tiếp nhận</Text>;
      default:
        return null;
    }
  };

  const getStatusPrefix = (status: string) => {
    switch (status) {
      case "cancelled":
        return " đã bị ";
      case "delivered":
        return " đã được giao ";
      case "pending":
        return " đã được ";
      default:
        return "";
    }
  };

  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    severity: "error" as "error" | "success" | "info" | "warning",
  });

  const showDialog = (
    title: string,
    description: string,
    severity: "error" | "success" | "info" | "warning"
  ) => {
    setDialogConfig({ title, description, severity });
    setDialogVisible(true);
  };

  const handlePayment = async () => {
    try {
      // Get scheme based on environment
      const scheme = __DEV__ ? "exp+allurespa" : "allurespa";

      const returnUrl = `${scheme}://transaction?status=success`;
      const cancelUrl = `${scheme}://transaction?status=cancel`;

      const payload = {
        amount: 2000,
        description: "Test payment",
        returnUrl,
        cancelUrl,
        // Add optional customer info if available
        buyerName: "Test User",
        buyerEmail: "test@example.com",
        buyerPhone: "0123456789",
        buyerAddress: "123 Test Street",
      };

      const apiUrl = `${Constants.expoConfig?.extra?.EXPO_PUBLIC_SERVER_URL}/api/payos/test`;

      console.log("Payment Request:", { url: apiUrl, payload });

      const response = await axios.post(apiUrl, payload);

      console.log("Payment Response:", response.data);

      if (response.data.success && response.data.checkoutUrl) {
        // Store orderCode for verification
        await AsyncStorage.setItem("payos_order_code", response.data.orderCode);

        router.push({
          pathname: "/webview",
          params: {
            url: response.data.checkoutUrl,
            type: WebViewType.PAYMENT,
          },
        });
      } else {
        showDialog(
          "Lỗi Thanh Toán",
          response.data.message || "Không thể tạo thanh toán",
          "error"
        );
      }
    } catch (error: any) {
      console.error("Payment Error:", {
        message: error.message,
        response: error.response?.data,
      });

      showDialog(
        "Lỗi Thanh Toán",
        error.response?.data?.message || "Đã có lỗi xảy ra khi tạo thanh toán",
        "error"
      );
    }
  };

  return (
    <View flex>
      <View style={styles.header}>
        <Button
          iconSource={require("@/assets/images/home/arrow_ios.png")}
          onPress={() => router.back()}
          link
          iconStyle={{ tintColor: "black" }}
        />
        <Text style={styles.headerTitle}>Giao dịch</Text>
      </View>

      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <View style={styles.row}>
              <Image
                source={require("@/assets/images/sp2.png")}
                style={styles.productImage}
              />
              <View style={styles.contentContainer}>
                <View style={styles.statusContainer}>
                  <Text style={styles.status} numberOfLines={2}>
                    <Text style={styles.normalText}>Đơn hàng số </Text>
                    <Text style={styles.orderNumber}>{item.orderNumber}</Text>
                    <Text style={styles.normalText}>
                      {getStatusPrefix(item.status)}
                    </Text>
                    {getStatusText(item.status)}
                  </Text>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.amount}>
                    Tổng: {item.totalAmount?.toLocaleString()} VNĐ
                  </Text>
                  <Text style={styles.date}>{item.date}</Text>
                </View>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.orderNumber}
      />

      <Button
        label="Thanh toán test"
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
        onPress={handlePayment}
      />

      <AppDialog
        visible={dialogVisible}
        title={dialogConfig.title}
        description={dialogConfig.description}
        severity={dialogConfig.severity}
        onClose={() => setDialogVisible(false)}
        closeButton={true}
        confirmButton={false}
        closeButtonLabel="Đóng"
      />
    </View>
  );
};

export default Transaction;
