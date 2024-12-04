import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native-ui-lib";
import { router, useNavigation } from "expo-router";
import BackButton from "@/assets/icons/back.svg";
import { useDispatch, useSelector } from "react-redux";
import { changePasswordThunk } from "@/redux";
import AppDialog from "@/components/dialog/AppDialog";
import AppBar from "@/components/app-bar/AppBar";
import { TextInput } from "@/components/inputs/TextInput";
import i18n from "@/languages/i18n";
import AppButton from "@/components/buttons/AppButton";
import { set } from "lodash";

interface ChangePasswordProps { }

const ChangePassword = (props: ChangePasswordProps) => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  // State for password fields
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [successDialog, setSuccessDialog] = useState(false);

  const handleChangePassword = async () => {
    setLoading(true);
    if (newPassword !== currentPassword) {
      setNewPasswordError(i18n.t("auth.register.password_current_new_mismatch"));
      setLoading(false);
      setError;
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(i18n.t("auth.register.password_mismatch"));
      setLoading(false);
      setError(i18n.t("auth.register.password_mismatch"));
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
        setLoading(false);
        navigation.goBack();
      } else {
        if (resultAction.payload) {
          setLoading(false);
          setError(resultAction.payload);
        } else {
          setLoading(false);
          setError("Change password failed");
        }
      }
    } catch (error: any) {
      setLoading(false);
      setError(error.message || "Change password failed");
    }
  };

  const validateCurrentPassword = (pass: string) => {
    if (!pass) {
      setCurrentPasswordError(i18n.t("auth.register.empty_password"));
      return false;
    }
    setCurrentPasswordError("");
    return true;
  };

  const validateNewPassword = (pass: string) => {
    if (!pass) {
      setNewPasswordError(i18n.t("auth.register.empty_password"));
      return false;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
    if (specialCharRegex.test(pass)) {
      setNewPasswordError(i18n.t("auth.register.invalid_password_special_char"));
      return false;
    }
    if (pass.length < 8) {
      setNewPasswordError(i18n.t("auth.register.invalid_password_length"));
      return false;
    }
    setNewPasswordError("");
    return true;
  };

  const validateConfirmPassword = (pass: string, confirmPass: string) => {
    if (pass !== confirmPass) {
      setConfirmPasswordError(i18n.t("auth.register.password_mismatch"));
      return false;
    }
    setConfirmPasswordError("");
    return true;
  };

  const handleSuccessDialog = () => {
    setSuccessDialog(false);
    router.back();
  }

  return (
    <View flex bg-white>
      <AppBar title={i18n.t("auth.change_password.title")} back />

      <View flex paddingH-18>
        <View paddingV-24>
          <Text h3>{i18n.t("auth.change_password.description")}</Text>
        </View>

        <TextInput
          title={i18n.t("auth.change_password.current_password")}
          placeholder={i18n.t("auth.change_password.enter_current_password")}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          onBlur={() => validateCurrentPassword(currentPassword)}
        />
        {currentPasswordError ? (
          <Text h3 secondary>{currentPasswordError}</Text>
        ) : null}

        <TouchableOpacity
          onPress={() => {
            console.log("Quên mật khẩu");
          }}
          style={{ alignSelf: "flex-end", marginBottom: 20 }}
        >
          <Text h3 secondary>{i18n.t("auth.login.forgot_password")}</Text>
        </TouchableOpacity>

        <TextInput
          title={i18n.t("auth.register.password")}
          placeholder={i18n.t("auth.change_password.enter_new_password")}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          onBlur={() => validateNewPassword(newPassword)}
        />
        {newPasswordError ? (
          <Text h3 secondary>{newPasswordError}</Text>
        ) : null}

        <TextInput
          title={i18n.t("auth.register.confirm_password")}
          placeholder={i18n.t("auth.change_password.enter_confirm_password")}
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          onBlur={() => validateConfirmPassword(newPassword, confirmPassword)}
        />
        {confirmPasswordError ? (
          <Text h3 secondary>{confirmPasswordError}</Text>
        ) : null}

        <View marginT-32>
          <AppButton
            title={i18n.t("auth.change_password.change_password")}
            type="primary"
            onPress={handleChangePassword}
            disabled={
              confirmPassword === "" ||
              currentPassword === "" ||
              newPassword === "" ||
              loading
            }
          />
        </View>

      </View>

      <AppDialog
        visible={successDialog}
        severity="success"
        title={i18n.t("auth.change_password.success")}
        confirmButtonLabel={i18n.t("auth.change_password.close")}
        closeButton={false}
        description={i18n.t("auth.change_password.success_description")}
        onConfirm={() => setSuccessDialog(false)}
      />

      <AppDialog
        visible={!!error}
        severity="error"
        title={i18n.t("auth.change_password.error")}
        confirmButtonLabel="Đóng"
        closeButton={false}
        description={error || i18n.t("auth.change_password.error_description")}
        onConfirm={() => setError(null)}
      />

      <AppDialog
        visible={loading}
        severity="info"
        title={i18n.t("auth.change_password.loading")}
        description={i18n.t("auth.change_password.loading_description")}
        closeButton={false}
        confirmButton={false}
      />
    </View>
  );
};

export default ChangePassword;
