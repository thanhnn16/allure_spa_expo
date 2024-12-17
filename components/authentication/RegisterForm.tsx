import React, { useState } from "react";
import { View, Text, Colors } from "react-native-ui-lib";
import { TextInput } from "@/components/inputs/TextInput";
import { useLanguage } from "@/hooks/useLanguage";
import AppButton from "@/components/buttons/AppButton";
import { Alert, ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useDialog } from "@/hooks/useDialog";
import AppDialog from "@/components/dialog/AppDialog";

interface RegisterFormProps {
  onBackPress: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onBackPress }) => {
  const { t } = useLanguage();
  const { dialogConfig, showDialog, hideDialog } = useDialog();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [fullNameError, setFullNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const { signUp } = useAuth();

  const validatePhoneNumber = (phone: string) => {
    if (!phone) {
      setPhoneError(t("auth.register.empty_phone_number"));
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError(t("auth.register.invalid_phone_number"));
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validateFullName = (name: string) => {
    if (!name) {
      setFullNameError(t("auth.register.empty_full_name"));
      return false;
    }
    const nameRegex = /^[^\d]+$/;
    if (!nameRegex.test(name)) {
      setFullNameError(t("auth.register.invalid_full_name"));
      return false;
    }
    setFullNameError("");
    return true;
  };

  const validatePassword = (pass: string) => {
    if (!pass) {
      setPasswordError(t("auth.register.empty_password"));
      return false;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
    if (specialCharRegex.test(pass)) {
      setPasswordError(t("auth.register.invalid_password_special_char"));
      return false;
    }
    if (pass.length < 8) {
      setPasswordError(t("auth.register.invalid_password_length"));
      return false;
    }
    setPasswordError("");
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

  const handleRegister = async () => {
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    const isFullNameValid = validateFullName(fullName);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(
        password,
        confirmPassword
    );

    if (
        !isPhoneValid ||
        !isFullNameValid ||
        !isPasswordValid ||
        !isConfirmPasswordValid
    ) {
      return;
    }

    setLoading(true);

    try {
      await signUp({ fullName, phoneNumber, password, confirmPassword });
    } catch (error: any) {
      showDialog(
          t("auth.register.error"),
          error.message || t("auth.login.unknown_error"),
          "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
      <>
        <TextInput
            title={t("auth.register.phone_number")}
            placeholder={t("auth.register.phone_number")}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            onBlur={() => validatePhoneNumber(phoneNumber)}
        />
        {phoneError ? <Text style={{ color: "red" }}>{phoneError}</Text> : null}

        <TextInput
            title={t("auth.register.fullname")}
            placeholder={t("auth.register.fullname")}
            value={fullName}
            onChangeText={setFullName}
            onBlur={() => validateFullName(fullName)}
        />
        {fullNameError ? (
            <Text style={{ color: "red" }}>{fullNameError}</Text>
        ) : null}

        <TextInput
            title={t("auth.register.password")}
            placeholder={t("auth.register.password")}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onBlur={() => validatePassword(password)}
        />
        {passwordError ? (
            <Text style={{ color: "red" }}>{passwordError}</Text>
        ) : null}

        <TextInput
            title={t("auth.register.confirm_password")}
            placeholder={t("auth.register.confirm_password")}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            onBlur={() => validateConfirmPassword(password, confirmPassword)}
        />
        {confirmPasswordError ? (
            <Text style={{ color: "red" }}>{confirmPasswordError}</Text>
        ) : null}

        <View marginV-20 gap-12>
          <AppButton
              type="primary"
              onPress={handleRegister}
              disabled={loading}
              buttonStyle={{
                backgroundColor: loading ? Colors.grey60 : Colors.primary,
              }}
              titleStyle={{ color: Colors.background }}
          >
            {loading ? (
                <ActivityIndicator size="small" color={Colors.primary} />
            ) : (
                <Text
                    style={{
                      color: "#FFFFFF",
                      fontFamily: "OpenSans-Regular",
                      fontWeight: "bold",
                    }}
                >
                  {t("auth.register.title")}
                </Text>
            )}
          </AppButton>
          <AppButton
              title={t("back")}
              type="outline"
              marginT-12
              onPress={onBackPress}
          />
        </View>

        <AppDialog
            visible={dialogConfig.visible}
            title={dialogConfig.title}
            description={dialogConfig.description}
            severity={dialogConfig.severity}
            onClose={hideDialog}
            closeButton={true}
            confirmButton={false}
            secondaryConfirmButton={false}
        />
      </>
  );
};

export default RegisterForm;
