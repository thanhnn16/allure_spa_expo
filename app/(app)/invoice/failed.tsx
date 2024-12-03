import { View, Text, Colors } from "react-native-ui-lib";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AppBar from "@/components/app-bar/AppBar";
import AppButton from "@/components/buttons/AppButton";
import { useLanguage } from "@/hooks/useLanguage";

export default function InvoiceFailed() {
  const { t } = useLanguage();

  const params = useLocalSearchParams<{
    reason: string;
    type: "cancel" | "failed";
    payment_method: string;
  }>();

  const getContent = () => {
    if (params.payment_method === "cash") {
      return {
        title: t("invoice.order_failed"),
        message: params.reason || t("invoice.order_failed_message"),
        icon: "error",
        iconColor: Colors.red30,
      };
    }
    if (params.type === "cancel") {
      return {
        title: t("invoice.payment_cancelled"),
        message: t("invoice.payment_cancel_message"),
        icon: "cancel",
        iconColor: Colors.secondary,
      };
    }
    return {
      title: t("invoice.payment_failed"),
      message: params.reason || t("invoice.payment_failed_message"),
      icon: "error",
      iconColor: Colors.red40,
    };
  };

  const content = getContent();

  return (
    <View flex bg-white>
      <AppBar title={content.title} />
      <View flex padding-20 center>
        <MaterialIcons
          name={content.icon as any}
          size={256}
          color={content.iconColor}
          style={{ marginBottom: 30 }}
        />
        <Text h1_bold center marginB-20>
          {content.title}
        </Text>
        <Text h2 body center marginB-30>
          {content.message}
        </Text>

        <View absB absL absR marginB-16 gap-10 paddingH-16>
          <AppButton
            title="Liên hệ hỗ trợ"
            onPress={() => router.replace("/(app)/(tabs)/chat")}
            type="outline"
          />
          <AppButton
            title={t("common.back_to_home")}
            onPress={() => router.replace("/(app)/")}
            type="primary"
          />
        </View>
      </View>
    </View>
  );
}
