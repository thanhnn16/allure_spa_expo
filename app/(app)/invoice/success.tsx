import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Colors, SkeletonView } from "react-native-ui-lib";
import { router, useLocalSearchParams } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import AppDialog from "@/components/dialog/AppDialog";
import AppButton from "@/components/buttons/AppButton";
import axios from "axios";
import i18n from "@/languages/i18n";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

interface PaymentDetails {
  amount: number;
  paymentTime: string;
  orderCode: string;
}

export default function InvoiceSuccess() {
  const params = useLocalSearchParams<{ invoice_id: string }>();
  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails | null>(
    null
  );
  const [showDialog, setShowDialog] = useState(true);

  useEffect(() => {
    fetchPaymentDetails();
  }, []);

  const fetchPaymentDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.EXPO_PUBLIC_SERVER_URL}/api/invoices/${params.invoice_id}/payment`
      );
      setPaymentDetails(response.data);
    } catch (error) {
      console.error("Error fetching payment details:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppBar title={i18n.t("invoice.payment_success")} />

      <View flex padding-20>
        {loading ? (
          // Skeleton loading state
          <View>
            <SkeletonView height={30} width={screenWidth * 0.6} marginB-10 />
            <SkeletonView height={20} width={screenWidth * 0.4} marginB-20 />
            <SkeletonView height={100} width={screenWidth} marginB-20 />
            <SkeletonView height={20} width={screenWidth * 0.8} marginB-10 />
            <SkeletonView height={20} width={screenWidth * 0.7} marginB-10 />
          </View>
        ) : (
          // Payment details
          <View>
            <Text h1 primary center marginB-10>
              {i18n.t("invoice.payment_details")}
            </Text>

            <View bg-white padding-20 br20 marginT-20>
              <View row spread marginB-10>
                <Text h3>{i18n.t("invoice.amount")}</Text>
                <Text h3 primary>
                  {paymentDetails?.amount
                    ? formatCurrency(paymentDetails.amount)
                    : "-"}
                </Text>
              </View>

              <View row spread marginB-10>
                <Text h3>{i18n.t("invoice.payment_time")}</Text>
                <Text h3>
                  {paymentDetails?.paymentTime
                    ? formatDate(paymentDetails.paymentTime)
                    : "-"}
                </Text>
              </View>

              <View row spread marginB-10>
                <Text h3>{i18n.t("invoice.order_code")}</Text>
                <Text h3>{paymentDetails?.orderCode || "-"}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Bottom buttons */}
        <View absB bottom-20 left-20 right-20>
          <AppButton
            title={i18n.t("common.back_to_home")}
            onPress={() => router.push("/(app)/")}
            type="primary"
          />
        </View>
      </View>

      {/* Success Dialog */}
      <AppDialog
        visible={showDialog}
        title={i18n.t("invoice.payment_successful")}
        description={i18n.t("invoice.payment_success_message")}
        severity="success"
        closeButton={false}
        confirmButton={true}
        confirmButtonLabel={i18n.t("common.ok")}
        onConfirm={() => setShowDialog(false)}
      />
    </SafeAreaView>
  );
}
