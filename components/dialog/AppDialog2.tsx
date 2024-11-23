import { Dialog, Text, View } from "react-native-ui-lib";
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { useLanguage } from "@/hooks/useLanguage";

const { t } = useLanguage();
import AppButton from "../buttons/AppButton";
import { ActivityIndicator } from "react-native";
import BlinkingIconText from "@/components/BlinkingIconText";
import React from "react";
import { ActionSheet } from "react-native-ui-lib";

interface AppDialogProps {
    visible: boolean;
    title: string;
    description?: string;
    closeButton?: boolean;
    confirmButton?: boolean;
    secondaryConfirmButton?: boolean;
    secondaryConfirmButtonLabel?: string;
    closeButtonLabel?: string;
    confirmButtonLabel?: string;
    onClose?: () => void;
    onConfirm?: () => void;
    onConfrimSecondary?: () => void;
    severity: "success" | "error" | "info" | "warning";
    loading?: boolean;
    children?: React.ReactNode;
    showActionSheet: boolean;
    setShowActionSheet: (visible: boolean) => void;
    setCombo: (combo: number) => void;
}

const AppDialog2 = ({
                        visible,
                        onClose,
                        onConfirm,
                        onConfrimSecondary,
                        severity,
                        title,
                        description,
                        closeButton = true,
                        confirmButton = true,
                        secondaryConfirmButton = true,
                        closeButtonLabel = t("common.cancel"),
                        confirmButtonLabel = t("common.confirm"),
                        secondaryConfirmButtonLabel = t("checkout.pay_online"),
                        loading = false,
                        children,
                        showActionSheet,
                        setShowActionSheet,
                        setCombo,
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
                {children && <View marginB-20>{children}</View>}
                <View>
                    <BlinkingIconText />
                </View>
                <View
                    style={{ borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 20, marginTop: 20, width: "100%",  }}
                    paddingH-20>
                    {confirmButton && (
                        <View marginBottom-10>
                            <AppButton
                                title={loading ? "" : confirmButtonLabel}
                                onPress={onConfirm}
                                type="outline"
                                disabled={loading}
                                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
                            >
                                {loading && (
                                    <ActivityIndicator size="small" color={Colors.background} />
                                )}
                            </AppButton>
                        </View>
                    )}
                    {secondaryConfirmButton && (
                        <View marginBottom-10  paddingT-10>
                            <AppButton
                                title={loading ? "" : secondaryConfirmButtonLabel}
                                onPress={onConfrimSecondary}
                                type="primary"
                                disabled={loading}
                            >
                                {loading && (
                                    <ActivityIndicator size="small" color={Colors.background} />
                                )}
                            </AppButton>
                        </View>
                    )}
                    {closeButton && (
                        <View marginBottom-10  paddingT-10>
                            <AppButton
                                title={loading ? "" : closeButtonLabel}
                                onPress={onClose}
                                type="text"
                                disabled={loading}
                                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}
                            >
                                {loading && (
                                    <ActivityIndicator size="small" color={Colors.background} />
                                )}
                            </AppButton>
                        </View>
                    )}
                </View>
                <ActionSheet
                    title={t("package.select_combo")}
                    cancelButtonIndex={4}
                    showCancelButton={true}
                    destructiveButtonIndex={0}
                    visible={showActionSheet}
                    containerStyle={{ padding: 10, gap: 10 }}
                    onDismiss={() => setShowActionSheet(false)}
                    useNativeIOS
                    options={[
                        {
                            label: t("package.single"),
                            onPress: () => setCombo(0),
                        },
                        {
                            label: t("package.combo5"),
                            onPress: () => setCombo(1),
                        },
                        {
                            label: t("package.combo10"),
                            onPress: () => setCombo(2),
                        },
                    ]}
                />
            </View>
        </Dialog>
    );
};

export default AppDialog2;
