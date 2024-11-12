import { router } from "expo-router";
import { View, Text, Colors, Button, Image } from "react-native-ui-lib";
import AppDialog from "@/components/dialog/AppDialog";
import { useState } from "react";
import AppBar from "@/components/app-bar/AppBar";
import i18n from "@/languages/i18n";
import { FlatList } from "react-native";

const Transaction = () => {
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    severity: "info",
  });

  const transactions = [
    {
      orderNumber: "123456",
      status: "pending",
      totalAmount: 1500000,
      date: "20/03/2024",
    },
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
    <View flex bg-white>
      <AppBar back title={i18n.t("pageTitle.order")} />
      <FlatList
        data={transactions}
        renderItem={({ item }) => (
          <View>
            <View>
              <View>
                <View>
                  <Text numberOfLines={2}>
                    <Text>{i18n.t("transaction.order_number")} </Text>
                    <Text>{item.orderNumber}</Text>
                    <Text>{getStatusPrefix(item.status)}</Text>
                    {getStatusText(item.status)}
                  </Text>
                </View>

                <View>
                  <Text>
                    {i18n.t("transaction.total_amount")}:{" "}
                    {item.totalAmount?.toLocaleString()} VNĐ
                  </Text>
                  <Text>{item.date}</Text>
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
        severity={
          dialogConfig.severity as "info" | "success" | "error" | "warning"
        }
        visible={dialogVisible}
        title={dialogConfig.title}
        description={dialogConfig.description}
        onClose={() => setDialogVisible(false)}
        closeButton={true}
        confirmButton={false}
        closeButtonLabel="Đóng"
      />
    </View>
  );
};

export default Transaction;
