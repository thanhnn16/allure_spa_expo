import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  RadioButton,
  RadioGroup,
} from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";

import AppBar from "@/components/app-bar/AppBar";
import AppButton from "@/components/buttons/AppButton";

const DeleteAccountVerifyScreen: React.FC = () => {
  const { t } = useLanguage();

  const [verify, setVerify] = useState("Có , gửi dữ liệu của tôi tới email");
  return (
    <View flex bg-white>
      <AppBar back title={t("deleteaccount.title")} />
      <View marginT-20 paddingH-24>
        <Text h0_bold>{t("deleteaccount.title")}</Text>
        <Text marginT-20 h2>
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
              <Text h2 color={verify === lang ? "black" : "grey"}>
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
      <View marginT-40 paddingH-20>
        <AppButton
          type="primary"
          title={t("deleteaccount.title")}
        />
      </View>
    </View>
  );
};
export default DeleteAccountVerifyScreen;
