import { View, Text } from "react-native-ui-lib";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { forgotPasswordThunk } from "@/redux/features/auth/forgotPasswordThunk";
import { TextInput } from "@/components/inputs/TextInput";
import AppButton from "@/components/buttons/AppButton";
import { useRouter } from "expo-router";
import { useLanguage } from "@/hooks/useLanguage";
import AppDialog from "@/components/dialog/AppDialog";
import { Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { sendVerifyEmailThunk } from "@/redux/features/auth/sendVerifyEmailThunk";

interface DialogConfig {
  visible: boolean;
  title: string;
  description: string;
  severity: "success" | "error" | "info" | "warning";
  confirmButton?: boolean;
  onConfirm?: () => void;
}

export default function ForgotPassword() {
  const { t } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [dialogConfig, setDialogConfig] = useState<DialogConfig>({
    visible: false,
    title: "",
    description: "",
    severity: "info"
  });

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setEmailError(t("auth.forgot_password.empty_email"));
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError(t("auth.forgot_password.invalid_email"));
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
        description: "Vui lòng kiểm tra email của bạn để nhận link đặt lại mật khẩu",
        severity: "success",
        confirmButton: true,
        onConfirm: () => {
          setDialogConfig({ ...dialogConfig, visible: false });
          router.replace("/login" as Href<string>);
        }
      });

    } catch (error: any) {
      console.log('=== FORGOT PASSWORD COMPONENT ERROR ===');
      console.log('Error:', error);
      console.log('=====================================');

      setDialogConfig({
        visible: true,
        title: t("common.error"),
        description: error || t("auth.forgot_password.verify_send_failed"),
        severity: "error",
        confirmButton: true,
        onConfirm: () => {
          setDialogConfig({ ...dialogConfig, visible: false });
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View flex paddingH-20>
        <Text h1_bold marginB-8>
          {t("auth.forgot_password.title")}
        </Text>

        <Text body marginB-20>
          Nhập email của bạn để nhận link đổi mật khẩu mới
        </Text>

        <View marginT-20>
          <Text text70BO marginB-8>
            Email
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Nhập email của bạn"
            keyboardType="email-address"
            autoCapitalize="none"
            onBlur={() => validateEmail(email)}
          />
          {emailError ? (
            <Text style={{ color: "red", marginTop: 4 }}>{emailError}</Text>
          ) : null}
          <Text gray text80 marginT-8>
            Chúng tôi sẽ gửi link đổi mật khẩu vào email của bạn
          </Text>
        </View>

        <View marginT-20>
          <AppButton
            title="Gửi yêu cầu đổi mật khẩu"
            type="primary"
            onPress={handleForgotPassword}
            loading={loading}
          />
          </View>
 <View marginT-10>
          <AppButton

            title={t("back")}
            type="outline"
            onPress={() => router.back()}
            marginT-12
          />
        </View>

        <AppDialog
          visible={dialogConfig.visible}
          title={dialogConfig.title}
          description={dialogConfig.description}
          severity={dialogConfig.severity}
          onClose={() => setDialogConfig({ ...dialogConfig, visible: false })}
          closeButton={true}
          confirmButton={dialogConfig.confirmButton}
          onConfirm={dialogConfig.onConfirm}
        />
      </View>
    </SafeAreaView>
  );
} 