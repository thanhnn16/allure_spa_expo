import React from "react";

import AppButton from "@/components/buttons/AppButton";
import { useZaloAuth } from "@/hooks/useZaloAuth";
import { Text, View } from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";

interface LoginZaloFormProps {
  onBackPress: () => void;
}

const LoginZaloForm: React.FC<LoginZaloFormProps> = ({ onBackPress }) => {
  const { t } = useLanguage();

  const { login, loading, error } = useZaloAuth();

  return (
    <View>
      <Text text70H>{t("auth.login.zalo_login_description")}</Text>
      {error && (
        <Text color="red" marginV-10>
          {error}
        </Text>
      )}
      <View marginV-20 gap-12>
        <AppButton
          type="primary"
          title={loading ? t("common.loading") : t("continue")}
          loading={loading}
          onPress={login}
        />
        <AppButton
          title={t("back")}
          type="outline"
          onPress={onBackPress}
          disabled={loading}
        />
      </View>
    </View>
  );
};

export default LoginZaloForm;
