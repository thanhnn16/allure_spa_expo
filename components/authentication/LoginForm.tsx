import React, { useState } from "react";
import { Colors, View, Text } from "react-native-ui-lib";
import { TextInput } from "@/components/inputs/TextInput";
import i18n from "@/languages/i18n";
import AppButton from "@/components/buttons/AppButton";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { ActivityIndicator } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useDialog } from "@/hooks/useDialog";
import AppDialog from "../dialog/AppDialog";

interface LoginFormProps {
  onBackPress: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onBackPress }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { signIn } = useAuth();
  const { showDialog, dialogConfig, hideDialog } = useDialog();

  const validatePhoneNumber = (phone: string) => {
    if (!phone) {
      setPhoneError(i18n.t("auth.login.empty_phone_number"));
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError(i18n.t("auth.login.invalid_phone_number"));
      return false;
    }
    setPhoneError("");
    return true;
  };

  const validatePassword = (pass: string) => {
    if (!pass) {
      setPasswordError(i18n.t("auth.login.empty_password"));
      return false;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
    if (specialCharRegex.test(pass)) {
      setPasswordError(i18n.t("auth.login.invalid_password_special_char"));
      return false;
    }
    if (pass.length < 8) {
      setPasswordError(i18n.t("auth.login.invalid_password_length"));
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleLogin = async () => {
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    const isPasswordValid = validatePassword(password);

    if (!isPhoneValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      await signIn({ phoneNumber, password });
    } catch (error: any) {
      showDialog(i18n.t("auth.login.error"), error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TextInput
        title={i18n.t("auth.register.phone_number")}
        placeholder={i18n.t("auth.register.phone_number")}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        onBlur={() => validatePhoneNumber(phoneNumber)}
      />
      {phoneError ? <Text style={{ color: "red" }}>{phoneError}</Text> : null}

      <TextInput
        title={i18n.t("auth.login.password")}
        placeholder={i18n.t("auth.login.password")}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onBlur={() => validatePassword(password)}
      />
      {passwordError ? (
        <Text style={{ color: "red" }}>{passwordError}</Text>
      ) : null}

      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginTop: 20,
        }}
      >
        <Text style={{ color: Colors.primary, fontSize: 16 }}>
          {i18n.t("auth.login.forgot_password")}
        </Text>
      </View>

      <View marginV-20 gap-12>
        <AppButton
          type="primary"
          onPress={handleLogin}
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
                fontSize: 20,
                fontFamily: "OpenSans-Regular",
                fontWeight: "bold",
              }}
            >
              {i18n.t("auth.login.title")}
            </Text>
          )}
        </AppButton>
        <AppButton
          title={i18n.t("back")}
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
      />
    </>
  );
};

export default LoginForm;
