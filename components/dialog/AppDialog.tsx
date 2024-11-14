import { Dialog, Button, Text, View } from "react-native-ui-lib";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import i18n from "@/languages/i18n";
import AppButton from "../buttons/AppButton";
import { ActivityIndicator } from "react-native";

interface AppDialogProps {
  visible: boolean;
  title: string;
  description: string;
  closeButton?: boolean;
  confirmButton?: boolean;
  closeButtonLabel?: string;
  confirmButtonLabel?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  severity: "success" | "error" | "info" | "warning";
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
  closeButtonLabel = i18n.t("common.cancel"),
  confirmButtonLabel = i18n.t("common.confirm"),
  loading = false,
}: AppDialogProps) => {
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
          <View center>
            <Text>{description}</Text>
          </View>
        </View>
        <View paddingH-20>
          {confirmButton && (
            <AppButton
              title={loading ? "" : confirmButtonLabel}
              onPress={onConfirm}
              type="primary"
              disabled={loading}
            >
              {loading && (
                <ActivityIndicator size="small" color={Colors.background} />
              )}
            </AppButton>
          )}
          {closeButton && (
            <AppButton
              title={loading ? "" : closeButtonLabel}
              onPress={onClose}
              type="text"
              disabled={loading}
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
