import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Colors } from "react-native-ui-lib";
import { router, useLocalSearchParams } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import AppBar from "@/components/app-bar/AppBar";
import AppButton from "@/components/buttons/AppButton";
import i18n from "@/languages/i18n";

export default function InvoiceFailed() {
  const params = useLocalSearchParams<{
    reason: string;
    type: "cancel" | "failed";
  }>();

  const getContent = () => {
    if (params.type === "cancel") {
      return {
        title: i18n.t("invoice.payment_cancelled"),
        message: i18n.t("invoice.payment_cancel_message"),
        icon: "cancel",
        iconColor: Colors.orange30,
      };
    }
    return {
      title: i18n.t("invoice.payment_failed"),
      message: params.reason || i18n.t("invoice.payment_failed_message"),
      icon: "error",
      iconColor: Colors.red30,
    };
  };

  const content = getContent();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
      <AppBar title={content.title} />

      <View flex padding-20 center>
        {/* Icon */}
        <MaterialIcons
          name={content.icon as any}
          size={120}
          color={content.iconColor}
          style={{ marginBottom: 30 }}
        />

        {/* Message */}
        <Text h2 center marginB-20>
          {content.title}
        </Text>
        <Text body center marginB-30>
          {content.message}
        </Text>

        {/* Button */}
        <View absB bottom-20 left-20 right-20>
          <AppButton
            title={i18n.t("common.back_to_home")}
            onPress={() => router.replace("/(app)/")}
            type="primary"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
