import { Dialog, Text, View } from "react-native-ui-lib";
import Colors from "@/constants/Colors";
import { useLanguage } from "@/hooks/useLanguage";

import AppButton from "../buttons/AppButton";
import React from "react";
import { ActionSheet } from "react-native-ui-lib";

interface ServiceBookingDialogProps {
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

const ServiceBookingDialog = ({
    visible,
    onClose,
    onConfirm,
    onConfrimSecondary,
    title,
    loading = false,
    children,
    showActionSheet,
    setShowActionSheet,
    setCombo,
}: ServiceBookingDialogProps) => {
    const { t } = useLanguage();

    const [selectedCombo, setSelectedCombo] = React.useState(0);
    const comboName = React.useMemo(() => {
        switch (selectedCombo) {
            case 1:
                return "Combo 5 buổi";
            case 2:
                return "Combo 10 buổi";
            default:
                return "Chưa chọn gói";
        }
    }, [selectedCombo]);


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
                <Text h1_bold center marginB-20>{title}</Text>

                {/* Highlight Combo Benefits */}
                <View marginB-20 br10 bg-grey70 padding-15>
                    <Text h2_bold center marginB-10 primary>Ưu đãi đặc biệt khi mua Combo</Text>
                    <View marginB-15 bg-white br10 padding-15>
                        <Text h3_bold>🎁 Combo 5 buổi:</Text>
                        <Text>• Giảm ngay 20% giá trị</Text>
                        <Text>• Tặng thêm 1 buổi miễn phí</Text>
                        <Text>• Thời hạn sử dụng 3 tháng</Text>
                    </View>
                    <View bg-white br10 padding-15>
                        <Text h3_bold>🎁 Combo 10 buổi:</Text>
                        <Text>• Giảm ngay 30% giá trị</Text>
                        <Text>• Tặng thêm 3 buổi miễn phí</Text>
                        <Text>• Thời hạn sử dụng 6 tháng</Text>
                    </View>
                </View>

                {/* Single Booking Option */}
                <View marginB-20 br10 bg-grey70 padding-15>
                    <Text h3>Đặt lịch một buổi</Text>
                    <Text secondary>Không áp dụng ưu đãi</Text>
                </View>

                <View row spread marginB-20>
                    <Text h2_medium>Gói đã chọn:</Text>
                    <Text h2_medium primary>{comboName}</Text>
                </View>

                {children}

                <View style={{ borderTopWidth: 1, borderTopColor: Colors.border, paddingTop: 20 }}>
                    {/* Primary CTA for Combo Purchase */}
                    <AppButton
                        title={selectedCombo > 0 ? "Mua combo ngay" : "Chọn combo để nhận ưu đãi"}
                        onPress={onConfrimSecondary}
                        type="primary"
                        disabled={loading || selectedCombo === 0}
                        marginB-10
                    />

                    {/* Secondary CTA for Single Booking */}
                    <AppButton
                        title="Đặt lịch một buổi"
                        onPress={onConfirm}
                        type="outline"
                        marginB-10
                    />

                    <AppButton
                        title="Đóng"
                        onPress={onClose}
                        type="text"
                    />
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
                            onPress: () => {
                                setSelectedCombo(0);
                                setCombo(0);
                            },
                        },
                        {
                            label: t("package.combo5"),
                            onPress: () => {
                                setSelectedCombo(1);
                                setCombo(1);
                            },
                        },
                        {
                            label: t("package.combo10"),
                            onPress: () => {
                                setSelectedCombo(2);
                                setCombo(2);
                            },
                        },
                    ]}
                />
            </View>
        </Dialog>
    );
};

export default ServiceBookingDialog;
