import { useEffect, useState } from "react";
import { View, Text, Colors, SkeletonView } from "react-native-ui-lib";
import { router, useLocalSearchParams } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import AppDialog from "@/components/dialog/AppDialog";
import AppButton from "@/components/buttons/AppButton";
import axios from "axios";
import { useLanguage } from "@/hooks/useLanguage";

import { Dimensions } from "react-native";
import formatCurrency from "@/utils/price/formatCurrency";
import { Ionicons } from "@expo/vector-icons";

const screenWidth = Dimensions.get("window").width;

interface PaymentDetails {
  amount: number;
  paymentTime: string;
  orderCode: string;
  paymentMethod: "cash" | "bank_transfer";
}

export default function InvoiceSuccess() {
  const { t } = useLanguage();

  const params = useLocalSearchParams<{
    order_id: string;
    invoice_id: string;
    amount: string;
    payment_time: string;
    payment_method: string;
  }>();

  const [showDialog, setShowDialog] = useState(true);

  const paymentDetails = {
    amount: Number(params.amount),
    paymentTime: params.payment_time,
    orderCode: params.order_id || params.invoice_id,
    paymentMethod: params.payment_method as "cash" | "bank_transfer"
  };

  const getSuccessMessage = () => {
    if (paymentDetails.paymentMethod === "cash") {
      return {
        title: t("invoice.order_success"),
        description: t("invoice.order_success_message_cash"),
      };
    }
    return {
      title: t("invoice.payment_successful"),
      description: t("invoice.payment_success_message"),
    };
  };

  return (
    <View flex bg-white>
      <AppBar title={t("invoice.payment_success")} />
      <View flex center gap-20 paddingH-24>
        <View center>
          <Ionicons
            name="checkmark-circle"
            size={256}
            color={Colors.primary}
          />
          <Text h1_bold center marginB-10>
            {paymentDetails.paymentMethod === "cash"
              ? t("invoice.order_details")
              : t("invoice.payment_details")}
          </Text>
          <Text h2 center marginB-10>
            {t("transaction.your_order")} #{paymentDetails.orderCode}{" "}
            {t("transaction.has_been_confirmed")}
          </Text>
        </View>

        <View width={"100%"} gap-12 absB marginB-10>
          <AppButton
            title={"Xem chi tiết đơn hàng"}
            onPress={() => router.push(`/order/${paymentDetails.orderCode}`)}
            type="outline"
          />
          <AppButton
            title={t("common.back_to_home")}
            onPress={() => router.replace("/(app)/")}
            type="primary"
          />
        </View>
      </View>

      <AppDialog
        visible={showDialog}
        {...getSuccessMessage()}
        severity="success"
        closeButton={false}
        confirmButton={true}
        confirmButtonLabel={t("common.ok")}
        onConfirm={() => setShowDialog(false)}
      />
    </View>
  );
}
