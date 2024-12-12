import { Dialog, Text, View } from "react-native-ui-lib";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useLanguage } from "@/hooks/useLanguage";

import AppButton from "../buttons/AppButton";
import { ActivityIndicator } from "react-native";

interface AppDialogProps {
  visible: boolean;
  title: string;
  description: string;
  severity: "success" | "error" | "info" | "warning";
  onClose: () => void;
  closeButton?: boolean;
  confirmButton?: boolean;
  onConfirm?: () => void;
  loading?: boolean;
}

const AppDialog = ({
  visible,
  onClose,
  onConfirm,
  severity,
  title,
  description,
  closeButton = true,
  confirmButton = true,
  loading = false,
}: AppDialogProps) => {
  const { t } = useLanguage();

  const defaultCloseLabel = t("close");
  const defaultConfirmLabel = t("common.confirm");

  const iconMap = {
    success: "check-circle",
    error: "error",
    info: "info",
    warning: "warning",
  };
  return (
    <Dialog
      visible={visible}
      onDismiss={onClose}
      containerStyle={{
        backgroundColor: Colors.background,
        borderRadius: 12,
        width: "100%",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
      overlayBackgroundColor={"rgba(0, 0, 0, 0.6)"}
    >
      <View bg-background padding-20 br20 width="100%">
        <View center marginB-20>
          <MaterialIcons
            name={
              iconMap[severity] as "check-circle" | "error" | "info" | "warning"
            }
            size={48}
            color={Colors.primary}
          />
        </View>
        <View marginB-20>
          <Text h2_bold center marginB-10 color={Colors.text}>
            {title}
          </Text>
          <View>
            <Text center>{description}</Text>
          </View>
        </View>
        <View paddingH-20>
          {confirmButton && (
            <AppButton
              title={defaultConfirmLabel}
              onPress={onConfirm}
              type="primary"
            >
              {loading && (
                <ActivityIndicator size="small" color={Colors.background} />
              )}
            </AppButton>
          )}
          {closeButton && (
            <AppButton
              title={defaultCloseLabel}
              onPress={onClose}
              type="text"
            >
              {loading && (
                <ActivityIndicator size="small" color={Colors.background} />
              )}
            </AppButton>
          )}
        </View>
      </View>
    </Dialog>
  );
};

export default AppDialog;
