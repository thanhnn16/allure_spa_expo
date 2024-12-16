import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native-ui-lib";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { changePasswordThunk } from "@/redux";
import AppDialog from "@/components/dialog/AppDialog";
import AppBar from "@/components/app-bar/AppBar";
import { TextInput } from "@/components/inputs/TextInput";
import AppButton from "@/components/buttons/AppButton";
import { useLanguage } from "@/hooks/useLanguage";

interface ChangePasswordProps { }

const ChangePassword = (props: ChangePasswordProps) => {
  const { t } = useLanguage();
  const dispatch = useDispatch();

  // State for password fields
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [currentPasswordError, setCurrentPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [forgotPasswordDialog, setForgotPasswordDialog] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [successDialog, setSuccessDialog] = useState(false);

  const handleChangePassword = async () => {
    setLoading(true);
    if (newPassword === currentPassword) {
      setNewPasswordError(t("auth.change_password.password_current_new_mismatch"));
      setLoading(false);
      setError;
      return;
    }
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError(t("auth.register.password_mismatch"));
      setLoading(false);
      setError(t("auth.register.password_mismatch"));
      return;
    }
    try {
      const resultAction = await dispatch(
        changePasswordThunk({
          current_password: currentPassword,
          new_password: newPassword,
          new_password_confirmation: confirmPassword,
        })
      );
      if (changePasswordThunk.fulfilled.match(resultAction)) {
        setLoading(false);
        setSuccessDialog(true);
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
      setCurrentPasswordError(t("auth.register.empty_password"));
      return false;
    }
    setCurrentPasswordError("");
    return true;
  };

  const validateNewPassword = (pass: string) => {
    if (!pass) {
      setNewPasswordError(t("auth.register.empty_password"));
      return false;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
    if (specialCharRegex.test(pass)) {
      setNewPasswordError(t("auth.register.invalid_password_special_char"));
      return false;
    }
    if (pass.length < 8) {
      setNewPasswordError(t("auth.register.invalid_password_length"));
      return false;
    }
    setNewPasswordError("");
    return true;
  };

  const validateConfirmPassword = (pass: string, confirmPass: string) => {
    if (pass !== confirmPass) {
      setConfirmPasswordError(t("auth.register.password_mismatch"));
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
      <AppBar title={t("auth.change_password.title")} back />

      <View flex paddingH-18>
        <View paddingV-24>
          <Text h3>{t("auth.change_password.description")}</Text>
        </View>

        <TextInput
          title={t("auth.change_password.current_password")}
          placeholder={t("auth.change_password.enter_current_password")}
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
          onBlur={() => validateCurrentPassword(currentPassword)}
        />
        {currentPasswordError ? (
          <Text h3 secondary>{currentPasswordError}</Text>
        ) : null}

        <AppButton
          buttonStyle={{
            justifyContent: "flex-end",
          }}
          type="text"
          title={t("auth.login.forgot_password")}
          onPress={() => {
            setForgotPasswordDialog(true);
          }}
        />
        <TextInput
          title={t("auth.register.password")}
          placeholder={t("auth.change_password.enter_new_password")}
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          onBlur={() => validateNewPassword(newPassword)}
        />
        {newPasswordError ? (
          <Text h3 secondary>{newPasswordError}</Text>
        ) : null}

        <TextInput
          title={t("auth.register.confirm_password")}
          placeholder={t("auth.change_password.enter_confirm_password")}
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
            title={t("auth.change_password.change_password")}
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
        title={t("auth.change_password.success")}
        confirmButtonLabel={t("auth.change_password.close")}
        closeButton={false}
        description={t("auth.change_password.success_description")}
        onConfirm={handleSuccessDialog}
      />

      <AppDialog
        visible={!!error}
        severity="error"
        title={t("auth.change_password.error")}
        confirmButtonLabel={t("close")}
        closeButton={false}
        description={error || t("auth.change_password.error_description")}
        onConfirm={() => setError(null)}
      />

      <AppDialog
        visible={loading}
        severity="info"
        title={t("auth.change_password.loading")}
        description={t("auth.change_password.loading_description")}
        closeButton={false}
        confirmButton={false}
      />

      <AppDialog
        visible={forgotPasswordDialog}
        severity="info"
        title={t("auth.change_password.forgot_password_guide")}
        description={t("auth.change_password.forgot_password_guide_description")}
        closeButton={true}
        confirmButton={false}
        onClose={() => setForgotPasswordDialog(false)}
      />
    </View>
  );
};

export default ChangePassword;
