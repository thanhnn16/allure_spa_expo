import { useState, useEffect } from "react";
import { View, Text } from "react-native-ui-lib";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "@/components/buttons/AppButton";
import { TextInput } from "@/components/inputs/TextInput";
import Colors from "@/constants/Colors";
import { useLanguage } from "@/hooks/useLanguage";
import AppBar from "@/components/app-bar/AppBar";
import AppDialog from "@/components/dialog/AppDialog";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { sendPhoneVerificationThunk, verifyPhoneThunk } from "@/redux/features/auth/phoneVerificationThunk";
import { clearPhoneVerification } from "@/redux/features/auth/phoneVerificationSlice";

export default function VerifyPhone() {
    const { t, currentLanguage } = useLanguage();
    const user = useSelector((state: RootState) => state.user.user);
    const phoneVerification = useSelector((state: RootState) => state.phoneVerification);
    const { isLoading, error, verificationId } = phoneVerification;
    const [verifyCode, setVerifyCode] = useState("");
    const [countdown, setCountdown] = useState(0);
    const [isVerificationSent, setIsVerificationSent] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [countdown]);

    const handleSendVerification = async () => {
        const response = await dispatch(sendPhoneVerificationThunk({ lang: currentLanguage })).unwrap();
        verificationId(response.verification_id);
        setIsVerificationSent(true);
        setCountdown(60);
    };

    const handleVerifyPhone = async () => {
        await dispatch(verifyPhoneThunk({
            verificationId: verificationId,
            code: verifyCode,
            lang: currentLanguage
        })).unwrap();
        router.push("/phone-verify/success");
    };

    const handleEditPhone = () => {
        router.push("/profile/edit");
    };

    return (
        <View flex bg-surface>
            <AppBar title={t("phone_verify.title")} back />

            <View flex paddingH-24 paddingT-40>
                <View center marginB-40>
                    <View
                        center
                        width={80}
                        height={80}
                        br60
                        backgroundColor={Colors.primary_blur}
                        marginB-24
                    >
                        <Ionicons name="phone-portrait" size={40} color={Colors.primary} />
                    </View>

                    {!isVerificationSent ? (
                        <>
                            <Text text60BO marginB-8 center color={Colors.text}>
                                {t("phone_verify.confirm_phone")}
                            </Text>

                            <Text text70 center color={Colors.text_secondary} marginB-16>
                                {t("phone_verify.confirm_phone_description")}
                            </Text>

                            <Text text70 center color={Colors.primary} marginB-24>
                                {user?.phone_number}
                            </Text>

                            <View row spread width="100%">
                                <View flex marginR-8>
                                    <AppButton
                                        type="outline"
                                        title={t("phone_verify.edit_phone")}
                                        onPress={handleEditPhone}
                                    />
                                </View>
                                <View flex marginL-8>
                                    <AppButton
                                        type="primary"
                                        title={t("phone_verify.send_verification")}
                                        onPress={handleSendVerification}
                                        disabled={isLoading}
                                    />
                                </View>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text text60BO marginB-8 center color={Colors.text}>
                                {t("phone_verify.enter_code")}
                            </Text>

                            <Text text70 center color={Colors.text_secondary} marginB-8>
                                {t("phone_verify.description")}
                            </Text>

                            <Text text70 center color={Colors.primary} marginB-24>
                                {user?.phone_number}
                            </Text>

                            <TextInput
                                placeholder={t("phone_verify.code_placeholder")}
                                value={verifyCode}
                                onChangeText={setVerifyCode}
                                keyboardType="number-pad"
                                maxLength={6}
                            />

                            <View marginT-24>
                                <AppButton
                                    type="primary"
                                    title={t("phone_verify.verify")}
                                    onPress={handleVerifyPhone}
                                    disabled={!verifyCode || isLoading}
                                />
                            </View>

                            <View marginT-16>
                                <AppButton
                                    type="text"
                                    title={countdown > 0
                                        ? `${t("phone_verify.resend_code")} (${countdown}s)`
                                        : t("phone_verify.resend_code")}
                                    onPress={handleSendVerification}
                                    disabled={isLoading || countdown > 0}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>

            <AppDialog
                visible={isLoading}
                severity="info"
                title={t("common.loading")}
                description={t("common.please_wait")}
                closeButton={false}
                confirmButton={false}
            />

            <AppDialog
                visible={!!error}
                severity="error"
                title={t("common.error")}
                description={error || ""}
                confirmButtonLabel={t("close")}
                onConfirm={() => dispatch(clearPhoneVerification())}
                closeButton={false}
            />
        </View>
    );
}