import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  RadioButton,
  RadioGroup,
} from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();
import AppBar from "@/components/app-bar/AppBar";

const DeleteAccountVerifyScreen: React.FC = () => {
  const [verify, setVerify] = useState("Có , gửi dữ liệu của tôi tới email");
  return (
    <View flex bg-white>
      <AppBar back title={t("deleteaccount.title")} />
      <View marginT-20 paddingH-24>
        <Text text40H>{t("deleteaccount.title")}</Text>
        <Text marginT-20 text70>
          {t("deleteaccount.description2")}
        </Text>
        <RadioGroup
          marginT-30
          initialValue={verify}
          onValueChange={(value: string) => setVerify(value)}
        >
          {[
            t("deleteaccount.verify_yes"),
            t("deleteaccount.verify_no"),
          ].map((lang) => (
            <View
              key={lang}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
                marginVertical: 5,
              }}
            >
              <Text text70 color={verify === lang ? "black" : "grey"}>
                {lang}
              </Text>
              <RadioButton
                value={lang}
                selected={verify === lang}
                color={"black"}
              />
            </View>
          ))}
        </RadioGroup>
      </View>
      <TouchableOpacity
        backgroundColor={"#717658"}
        style={{
          borderRadius: 15,
          paddingVertical: 16,
          alignItems: "center",
          justifyContent: "center",
          marginTop: 150,
          height: 55,
        }}
      >
        <Text white text70H>
          {t("deleteaccount.title")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
export default DeleteAccountVerifyScreen;
