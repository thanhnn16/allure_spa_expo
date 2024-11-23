import React from "react";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();
import AppButton from "@/components/buttons/AppButton";
import { useZaloAuth } from "@/hooks/useZaloAuth";
import { Text, View } from "react-native-ui-lib";

interface LoginZaloFormProps {
  onBackPress: () => void;
}

const LoginZaloForm: React.FC<LoginZaloFormProps> = ({ onBackPress }) => {
  const { login, loading, error } = useZaloAuth();

  return (
    <View>
      <Text text70H>{t("auth.login.zalo_login_description")}</Text>
      <View marginV-20 gap-12>
        <AppButton
          type="primary"
          title={t("continue")}
          loading={loading}
          onPress={login}
        />
        <AppButton
          title={t("back")}
          type="outline"
          onPress={onBackPress}
        />
      </View>
    </View>
  );
};

export default LoginZaloForm;
