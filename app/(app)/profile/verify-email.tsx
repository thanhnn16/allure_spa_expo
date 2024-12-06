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
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { sendVerificationEmailThunk, verifyEmailThunk } from "@/redux/features/auth/emailVerificationThunk";

export default function VerifyEmail() {
    const { t, currentLanguage } = useLanguage();
    const user = useSelector((state: RootState) => state.user.user);
    const [verifyCode, setVerifyCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
        try {
            setLoading(true);
            await dispatch(sendVerificationEmailThunk({ lang: currentLanguage })).unwrap();
            setIsVerificationSent(true);
            setCountdown(60);
        } catch (error: any) {
            setError(error.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmail = async () => {
        try {
            setLoading(true);
            await dispatch(verifyEmailThunk({ token: verifyCode, lang: currentLanguage })).unwrap();
            router.push("/email-verify/success");
        } catch (error: any) {
            setError(error.message || 'Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    const handleEditEmail = () => {
        router.push("/profile/edit");
    };

    return (
        <View flex bg-surface>
            <AppBar title={t("email_verify.title")} back />

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
                        <Ionicons name="mail" size={40} color={Colors.primary} />
                    </View>

                    {!isVerificationSent ? (
                        <>
                            <Text text60BO marginB-8 center color={Colors.text}>
                                {t("email_verify.confirm_email")}
                            </Text>

                            <Text text70 center color={Colors.text_secondary} marginB-16>
                                {t("email_verify.confirm_email_description")}
                            </Text>

                            <Text text70 center color={Colors.primary} marginB-24>
                                {user?.email}
                            </Text>

                            <View row spread width="100%">
                                <View flex marginR-8>
                                    <AppButton
                                        type="outline"
                                        title={t("email_verify.edit_email")}
                                        onPress={handleEditEmail}
                                    />
                                </View>
                                <View flex marginL-8>
                                    <AppButton
                                        type="primary"
                                        title={t("email_verify.send_verification")}
                                        onPress={handleSendVerification}
                                        disabled={loading}
                                    />
                                </View>
                            </View>
                        </>
                    ) : (
                        <>
                            <Text text60BO marginB-8 center color={Colors.text}>
                                {t("email_verify.enter_code")}
                            </Text>

                            <Text text70 center color={Colors.text_secondary} marginB-8>
                                {t("email_verify.description")}
                            </Text>

                            <Text text70 center color={Colors.primary} marginB-24>
                                {user?.email}
                            </Text>

                            <TextInput
                                placeholder={t("email_verify.code_placeholder")}
                                value={verifyCode}
                                onChangeText={setVerifyCode}
                                keyboardType="number-pad"
                                maxLength={255}
                            />

                            <View marginT-24>
                                <AppButton
                                    type="primary"
                                    title={t("email_verify.verify")}
                                    onPress={handleVerifyEmail}
                                    disabled={!verifyCode || loading}
                                />
                            </View>

                            <View marginT-16>
                                <AppButton
                                    type="text"
                                    title={countdown > 0
                                        ? `${t("email_verify.resend_code")} (${countdown}s)`
                                        : t("email_verify.resend_code")}
                                    onPress={handleSendVerification}
                                    disabled={loading || countdown > 0}
                                />
                            </View>
                        </>
                    )}
                </View>
            </View>

            <AppDialog
                visible={loading}
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
                onConfirm={() => setError(null)}
                closeButton={false}
            />
        </View>
    );
}