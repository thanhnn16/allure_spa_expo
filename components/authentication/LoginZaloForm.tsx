import React, { useState } from "react";
import i18n from "@/languages/i18n";
import AppButton from "@/components/buttons/AppButton";
import {
  generateCodeChallenge,
  generateCodeVerifier,
  getZaloOauthUrl,
  openZaloLogin,
} from "@/utils/services/zalo/zaloAuthService";
import { router } from "expo-router";
import { Text, View } from "react-native-ui-lib";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface LoginZaloFormProps {
  onBackPress: () => void;
}

const LoginZaloForm: React.FC<LoginZaloFormProps> = ({ onBackPress }) => {
  const [loading, setLoading] = useState(false);

  const handleZaloLogin = async () => {
    try {
      setLoading(true);
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);

      // Save code verifier for later use
      await AsyncStorage.setItem("zalo_code_verifier", codeVerifier);

      const zaloUrl = getZaloOauthUrl(codeChallenge);

      // Check if Zalo app is installed
      const canOpenZalo = await Linking.canOpenURL("zalo://");

      if (canOpenZalo) {
        // Open Zalo app
        openZaloLogin(codeChallenge);
      } else {
        // Open WebView
        router.push({
          pathname: "/webview",
          params: { url: zaloUrl },
        });
      }
    } catch (error) {
      console.error("Error during Zalo login:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Text text70H>{i18n.t("auth.login.zalo_login_description")}</Text>
      <View marginT-10 marginB-20>
        <AppButton
          type="primary"
          title={i18n.t("continue")}
          loading={loading}
          onPress={handleZaloLogin}
        />
        <AppButton
          title={i18n.t("back")}
          type="outline"
          marginT-12
          onPress={onBackPress}
        />
      </View>
    </View>
  );
};

export default LoginZaloForm;
