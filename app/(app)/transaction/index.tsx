import { router } from "expo-router";
import { SafeAreaView } from "react-native";
import { View, Text, Colors, Button, Image } from "react-native-ui-lib";

import SuccessIcon from "@/assets/icons/star.svg";
import FailIcon from "@/assets/icons/star_half.svg";
import i18n from "@/languages/i18n";

const Transaction = () => {
  const isSuccess = true;

  const renderIcon = () => {
    if (isSuccess) {
      return SuccessIcon;
    }
    return FailIcon;
  };

  const renderButton = () => {
    if (isSuccess) {
      return (
        <Button
          label={i18n.t("transaction.detail_order").toString()}
          labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
          backgroundColor={Colors.primary}
          padding-20
          style={{ height: 50 }}
          borderRadius={13}
          onPress={() => router.push("/(app)/transaction/detail")}
        />
      );
    }
    return (
      <Button
        label={i18n.t("transaction.contact_support").toString()}
        labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
        backgroundColor={Colors.primary}
        padding-20
        style={{ height: 50 }}
        borderRadius={13}
        onPress={() => router.dismissAll()}
      />
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      <View flex centerV centerH gap-10 paddingH-20>
        <Image source={renderIcon()} width={200} height={200} />
        {isSuccess ? (
          <Text h2_bold color={Colors.primary}>
            {i18n.t("transaction.payment_success")}
          </Text>
        ) : (
          <Text h2_bold>{i18n.t("transaction.payment_fail")}</Text>
        )}
        {isSuccess ? (
          <Text h3 center color={Colors.grey40}>
            {i18n.t("transaction.your_order")} #123456{" "}
            {i18n.t("transaction.has_been_confirmed")}
          </Text>
        ) : (
          <Text h3 center color={Colors.grey40}>
            {i18n.t("transaction.your_order")} #123456{" "}
            {i18n.t("transaction.has_been_failed")}
          </Text>
        )}
      </View>
      <View bottom gap-10 marginB-10 paddingH-20>
        {renderButton()}
        <Button
          label={i18n.t("transaction.back_home").toString()}
          labelStyle={{ fontFamily: "SFProText-Bold", fontSize: 16 }}
          backgroundColor={Colors.primary}
          padding-20
          style={{ height: 50 }}
          borderRadius={13}
          onPress={() => router.replace("/(app)/home")}
        />
      </View>
    </SafeAreaView>
  );
};

export default Transaction;
