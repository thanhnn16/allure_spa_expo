import React, { useState } from "react";
import { View, Text } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "@/hooks/useLanguage";
import { TextInput } from "@/components/inputs/TextInput";
import AppButton from "@/components/buttons/AppButton";
import { useRouter, Href } from "expo-router";
import { useDispatch } from "react-redux";
import { forgotPasswordThunk } from "@/redux/features/auth/forgotPasswordThunk";
import AppDialog from "@/components/dialog/AppDialog";
import { AppDispatch } from "@/redux/store";
import Colors from "@/constants/Colors";
import { ImageBackground } from "react-native";

export default function ForgotPassword() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [dialogConfig, setDialogConfig] = useState({
    visible: false,
    title: "",
    description: "",
    severity: "info" as "success" | "error" | "info" | "warning"
  });

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError(t("auth.forgot_password.email_required"));
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError(t("auth.forgot_password.email_invalid"));
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) return;

    setLoading(true);
    try {
      await dispatch(forgotPasswordThunk(email)).unwrap();
      
      setDialogConfig({
        visible: true,
        title: "Gửi yêu cầu thành công",
        description: "Vui lòng kiểm tra email để đặt lại mật khẩu",
        severity: "success"
      });

      router.replace("/login" as Href<string>);

    } catch (error: any) {
      setDialogConfig({
        visible: true,
        title: "Lỗi",
        description: error || "Không thể gửi yêu cầu đặt lại mật khẩu",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground 
      source={require("@/assets/images/authen/img_bg_authen.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <View flex paddingH-24>
          <View 
            style={{
              backgroundColor: Colors.white,
              borderRadius: 24,
              padding: 24,
              marginTop: 40,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.1,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text style={{ 
              fontSize: 28,
              color: Colors.text,
              fontWeight: 'bold',
              marginBottom: 12,
              width: '100%',
              flexWrap: 'wrap'
            }}>
              {t("auth.forgot_password.title")}
            </Text>
            <Text style={{ 
              fontSize: 16, 
              color: Colors.grey30,
              lineHeight: 24,
              marginBottom: 40
            }}>
              {t("auth.forgot_password.description")}
            </Text>

            <View style={{ width: '100%' }}>
              <Text style={{ 
                fontSize: 16,
                color: Colors.text,
                fontWeight: '600',
                marginBottom: 12
              }}>
                {t("auth.forgot_password.email_label")}
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder={t("auth.forgot_password.email_placeholder")}
                keyboardType="email-address"
                onBlur={() => validateEmail(email)}
                style={{
                  height: 56,
                  paddingHorizontal: 20,
                  borderWidth: 1.5,
                  borderRadius: 16,
                  borderColor: emailError ? Colors.red30 : Colors.grey50,
                  backgroundColor: Colors.white,
                  fontSize: 16,
                  color: Colors.text,
                }}
              />
              {emailError ? (
                <Text style={{ 
                  color: Colors.red30, 
                  marginTop: 8, 
                  fontSize: 14,
                  marginLeft: 4
                }}>
                  {emailError}
                </Text>
              ) : (
                <Text style={{ 
                  fontSize: 14,
                  color: Colors.grey30,
                  marginTop: 8,
                  marginLeft: 4,
                  lineHeight: 20
                }}>
                  {t("auth.forgot_password.email_hint")}
                </Text>
              )}
            </View>
          </View>

          <View flex bottom marginB-32>
            <AppButton
              title={t("auth.forgot_password.continue")}
              type="primary"
              onPress={handleForgotPassword}
              loading={loading}
              buttonStyle={{
                height: 56,
                borderRadius: 16,
                marginBottom: 16
              }}
              titleStyle={{
                fontSize: 18,
                fontWeight: '600',
              }}
            />

            <AppButton
              title={t("auth.forgot_password.back_to_login")}
              type="outline"
              onPress={() => router.back()}
              buttonStyle={{
                height: 56,
                borderRadius: 16,
                borderWidth: 1.5
              }}
              titleStyle={{
                fontSize: 16,
                fontWeight: '600'
              }}
            />
          </View>

          <AppDialog
            visible={dialogConfig.visible}
            title={t(dialogConfig.visible && dialogConfig.severity === "success" 
              ? "auth.forgot_password.success_title" 
              : "auth.forgot_password.error_title")}
            description={dialogConfig.description}
            severity={dialogConfig.severity}
            onClose={() => setDialogConfig({ ...dialogConfig, visible: false })}
            closeButton={true}
            confirmButton={false}
          />
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
} 