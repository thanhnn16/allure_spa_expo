import React, { useState } from "react";
import { View, Text } from "react-native-ui-lib";
import { router } from "expo-router";
import { TextInput } from "react-native";
import { useLanguage } from "@/hooks/useLanguage";

import AppBar from "@/components/app-bar/AppBar";
import AppButton from "@/components/buttons/AppButton";

const DeleteAccountScreen: React.FC = () => {
  const { t } = useLanguage();

  const [value, onChangeText] = useState("");
  return (
    <View flex bg-white>
      <AppBar back title={t("deleteAccount.title")} />
      <View flex bg-white paddingH-24>
        <View marginT-20>
          <Text h0_bold>{t("deleteAccount.title")}</Text>
          <Text marginT-20 h2>
            {t("deleteAccount.description")}
          </Text>

          <TextInput
            placeholder={t("deleteAccount.placeholder")}
            maxLength={500}
            onChangeText={(text) => onChangeText(text)}
            value={value}
            multiline={true}
            style={{
              height: 180,
              borderWidth: 1,
              borderColor: "#D9D9D9",
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 16,
              marginTop: 20,
              textAlignVertical: "top",
            }}
          />
        </View>
        <View marginT-40>
          <AppButton
            type="primary"
            title={t("deleteAccount.next")}
            onPress={() => router.push("/(app)/profile/delete-account-verify")}
          />
        </View>
      </View>
    </View>
  );
};

export default DeleteAccountScreen;
