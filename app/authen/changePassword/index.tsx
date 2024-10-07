import React from "react";
import { View, Text, TouchableOpacity, Image, Card } from "react-native-ui-lib";
import { useNavigation } from "expo-router";

import BackButton from "@/assets/icons/back.svg";
interface changePasswordProps {}

const ChangePassword = (props: changePasswordProps) => {
  const navigation = useNavigation();

  return (
    <View flex marginH-20 marginT-20>
      <View row centerV>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
            console.log("Back");
          }}
        >
          <Image width={30} height={30} source={BackButton} />
        </TouchableOpacity>
      </View>
      <View marginT-30 gap-7>
        <Text text50 marginR-30>
          Tạo mật khẩu mới
        </Text>
        <Text>
          Mật khẩu mới của bạn phải khác với mật khẩu từng sử dụng.
        </Text>
      </View>
    </View>
  );
};

export default ChangePassword;
