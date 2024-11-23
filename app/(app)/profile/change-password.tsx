import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native-ui-lib";
import { TextInput } from "react-native";
import { useNavigation } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordThunk } from "@/redux";
import AppDialog from "@/components/dialog/AppDialog";

interface ChangePasswordProps {}

const ChangePassword = (props: ChangePasswordProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // State for password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      const resultAction = await dispatch(
        changePasswordThunk({
          current_password: currentPassword,
          newPassword: newPassword,
          new_password_confirmation: confirmPassword,
        })
      );
      if (changePasswordThunk.fulfilled.match(resultAction)) {
        console.log("Change password success");
        navigation.goBack();
      } else {
        if (resultAction.payload) {
          setError(resultAction.payload);
        } else {
          setError("Change password failed");
        }
      }
    } catch (error: any) {
      console.error("Change password error:", error);
      setError(error.message || "Change password failed");
    }

    // Handle password change logic here
    console.log("Current Password:", currentPassword);
    console.log("New Password:", newPassword);
    console.log("Confirm Password:", confirmPassword);
  };

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
        <Text>Mật khẩu mới của bạn phải khác với mật khẩu từng sử dụng.</Text>
      </View>
      <View marginT-30>
        <Text marginB-10>Nhập mật khẩu cũ</Text>
        <TextInput
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          style={{
            borderWidth: 1,
            height: 45,
            borderColor: "#000000",
            borderRadius: 10,
            paddingHorizontal: 10,

            marginBottom: 20,
          }}
        />
        <TouchableOpacity
          onPress={() => {
            console.log("Quên mật khẩu");
            // Add your forgot password logic here
          }}
          style={{ alignSelf: "flex-end", marginBottom: 20 }}
        >
          <Text style={{ color: "red" }}>Quên mật khẩu ?</Text>
        </TouchableOpacity>
        <Text marginB-10>Mật khẩu mới</Text>
        <TextInput
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          style={{
            borderWidth: 1,
            height: 45,
            borderColor: "#000000",
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: 20,
          }}
        />
        <Text marginB-10>Xác nhận mật khẩu mới</Text>
        <TextInput
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={{
            borderWidth: 1,
            height: 45,
            borderColor: "#000000",
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: 20,
          }}
        />
      </View>
      <View marginT-30>
        <TouchableOpacity
          center
          style={{
            width: "100%",
            height: 50,
            backgroundColor: "#717658",
            padding: 10,
            borderRadius: 15,
            elevation: 5,
            marginTop: 20,
          }}
          onPress={handleChangePassword}
        >
          <Text center white text70BO>
            Đổi mật khẩu
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChangePassword;
