import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  RadioButton,
  RadioGroup,
} from "react-native-ui-lib";
import { router } from "expo-router";
import { SafeAreaView, TextInput } from "react-native";
import i18n from "@/languages/i18n";
// import { TextInput,TextInputProps } from "@/components/inputs/TextInput";

const DeleteAccountVerifyScreen: React.FC = () => {
  const [verify, setVerify] = useState("Có , gửi dữ liệu của tôi tới email");
  return (
      <View flex paddingH-20 paddingV-40>
        <View row marginB-20>
          <Button
            iconSource={require("@/assets/images/home/arrow_ios.png")}
            onPress={() => router.back()}
            link
            iconStyle={{ tintColor: "black" }}
          ></Button>
        </View>
        <View marginT-20>
          <Text text40H>{i18n.t("deleteaccount.title")}</Text>
          <Text marginT-20 text70>
            {i18n.t("deleteaccount.description2")}
          </Text>
          <RadioGroup
            marginT-30
            initialValue={verify}
            onValueChange={(value: string) => setVerify(value)}
          >
            {[i18n.t("deleteaccount.verify_yes"),i18n.t("deleteaccount.verify_no")].map(
              (lang) => (
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
              )
            )}
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
           {i18n.t("deleteaccount.title")}
          </Text>
        </TouchableOpacity>
      </View>
  );
};
export default DeleteAccountVerifyScreen;
