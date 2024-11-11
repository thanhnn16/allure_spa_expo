import { router } from "expo-router";
import { SafeAreaView, FlatList } from "react-native";
import { View, Text, Colors, Button, Image } from "react-native-ui-lib";
import AppDialog from "@/components/dialog/AppDialog";
import { useState } from "react";

const Transaction = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    severity: "info"
  });

  const transactions = [
    {
      orderNumber: "123456",
      status: "pending",
      totalAmount: 1500000,
      date: "20/03/2024"
    }
  ];

  const getStatusPrefix = (status: string) => {
    switch (status) {
      case "pending":
        return " đang ";
      default:
        return " đã ";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "chờ xử lý";
      case "confirmed":
        return "xác nhận";
      case "delivering":
        return "giao hàng";
      case "completed":
        return "hoàn thành";
      default:
        return status;
    }
  };

  const handlePayment = () => {
    router.push("/(app)/transaction/detail");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
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
    </SafeAreaView>
  );
};

export default Transaction;
