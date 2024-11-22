import React, { useEffect, useState } from "react";
import { View, Text, Colors, SkeletonView } from "react-native-ui-lib";
import { router, useLocalSearchParams } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import AppDialog from "@/components/dialog/AppDialog";
import AppButton from "@/components/buttons/AppButton";
import axios from "axios";
import i18n from "@/languages/i18n";
import { Dimensions } from "react-native";
import Constants from "expo-constants";
import formatCurrency from "@/utils/price/formatCurrency";

const screenWidth = Dimensions.get("window").width;

interface PaymentDetails {
  amount: number;
  paymentTime: string;
  orderCode: string;
  paymentMethod: "cash" | "bank_transfer";
}

export default function InvoiceSuccess() {
  const params = useLocalSearchParams<{
    order_id: string;
    invoice_id: string;
    amount: string;
    payment_time: string;
    payment_method: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [showDialog, setShowDialog] = useState(true);

  useEffect(() => {
    if (params.amount && params.payment_time) {
      setPaymentDetails({
        amount: Number(params.amount),
        paymentTime: params.payment_time,
        orderCode: params.order_id || params.invoice_id,
        paymentMethod: params.payment_method as "cash" | "bank_transfer",
      });
      setLoading(false);
    } else {
      fetchPaymentDetails();
    }
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      const endpoint = params.invoice_id
        ? `/api/invoices/${params.invoice_id}/payment`
        : `/api/orders/${params.order_id}`;

      const response = await axios.get(
        `${Constants.expoConfig?.extra?.EXPO_PUBLIC_SERVER_URL}${endpoint}`
      );
      setPaymentDetails(response.data);
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSuccessMessage = () => {
    if (paymentDetails?.paymentMethod === "cash") {
      return {
        title: i18n.t("invoice.order_success"),
        description: i18n.t("invoice.order_success_message_cash"),
      };
    }
    return {
      title: i18n.t("invoice.payment_successful"),
      description: i18n.t("invoice.payment_success_message"),
    };
  };

  return (
    <View flex bg-white>
      <AppBar title={i18n.t("invoice.payment_success")} />
      <View flex center gap-20 paddingH-24>
        {loading ? (
          <View>
            <SkeletonView height={30} width={screenWidth * 0.6} marginB-10 />
            <SkeletonView height={20} width={screenWidth * 0.4} marginB-20 />
            <SkeletonView height={100} width={screenWidth} marginB-20 />
            <SkeletonView height={20} width={screenWidth * 0.8} marginB-10 />
            <SkeletonView height={20} width={screenWidth * 0.7} marginB-10 />
          </View>
        ) : (
          <View>
            <Text h1 primary center marginB-10>
              {paymentDetails?.paymentMethod === "cash"
                ? i18n.t("invoice.order_details")
                : i18n.t("invoice.payment_details")}
            </Text>

            <View br20 gap-10>
              <View row spread>
                <Text h3>{i18n.t("invoice.amount")}</Text>
                <Text h3 primary>
                  {paymentDetails?.amount
                    ? formatCurrency({ price: paymentDetails.amount })
                    : "-"}
                </Text>
              </View>

              {paymentDetails?.paymentMethod === "bank_transfer" && (
                <View row spread>
                  <Text h3>{i18n.t("invoice.payment_time")}</Text>
                  <Text h3>
                    {paymentDetails?.paymentTime
                      ? new Date(paymentDetails.paymentTime).toLocaleString()
                      : "-"}
                  </Text>
                </View>
              )}

              <View row spread>
                <Text h3>{i18n.t("invoice.order_code")}</Text>
                <Text h3>{paymentDetails?.orderCode || "-"}</Text>
              </View>
            </View>
          </View>
        )}

        <View width={"100%"} gap-12 absB marginB-10>
          <AppButton
            title={"Xem chi tiết đơn hàng"}
            buttonStyle={{ backgroundColor: Colors.secondary }}
            onPress={() =>
              router.replace(`/order/${paymentDetails?.orderCode}`)
            }
            type="primary"
          />
          <AppButton
            title={i18n.t("common.back_to_home")}
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
        confirmButtonLabel={i18n.t("common.ok")}
        onConfirm={() => setShowDialog(false)}
      />
    </View>
  );
}
