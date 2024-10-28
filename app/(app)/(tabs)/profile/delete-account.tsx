import React, { useState } from "react";
import { View, Text, Button, TouchableOpacity } from "react-native-ui-lib";
import { router } from "expo-router";
import { SafeAreaView, TextInput } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import i18n from "@/languages/i18n";

// import { TextInput,TextInputProps } from "@/components/inputs/TextInput";

const DeleteAccountScreen: React.FC = () => {
  const [value, onChangeText] = useState("");
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 40 }}>
        <View row marginB-20>
          <Button
            iconSource={require("@/assets/images/home/arrow_ios.png")}
            onPress={() => router.back()}
            link
            iconStyle={{ tintColor: "black" }}
          ></Button>
        </View>
        <View marginT-20>
          <Text text40H>{i18n.t("deleteacount.title")}</Text>
          <Text marginT-20 text70>
           {i18n.t("deleteaccount.description")}
          </Text>

          <TextInput
            placeholder={i18n.t("deleteaccount.placeholder")}
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
        <TouchableOpacity
          backgroundColor={"#717658"}
          style={{
            borderRadius: 15,
            paddingVertical: 16,
            alignItems: "center",
            justifyContent: "center",
            marginTop: 80,
            height: 55,
          }}
        >
          <Text white text70H>{i18n.t("deleteaccount.next")}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
export default DeleteAccountScreen;
