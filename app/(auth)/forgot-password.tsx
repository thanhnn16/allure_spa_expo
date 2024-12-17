import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image } from "react-native-ui-lib";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLanguage } from "@/hooks/useLanguage";
import { TextInput } from "@/components/inputs/TextInput";
import AppButton from "@/components/buttons/AppButton";
import { useRouter } from "expo-router";
import { useDispatch } from "react-redux";
import { forgotPasswordThunk } from "@/redux/features/auth/forgotPasswordThunk";
import AppDialog from "@/components/dialog/AppDialog";
import { AppDispatch } from "@/redux/store";
import Colors from "@/constants/Colors";
import { ImageBackground, KeyboardAvoidingView, Platform, Animated, Dimensions, ActivityIndicator } from "react-native";
import { useDialog } from "@/hooks/useDialog";
import Brand from "@/assets/images/common/logo-brand.svg";
const { width, height } = Dimensions.get("window");

export default function ForgotPassword() {
    const { t, currentLanguage } = useLanguage();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailError, setEmailError] = useState("");
    const { dialogConfig, showDialog, hideDialog } = useDialog();

    const validateEmail = (email: string) => {
        if (!email) {
            setEmailError(t("auth.forgot_password.email_required"));
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setEmailError(t("auth.forgot_password.email_invalid"));
            return false;
        }
        setEmailError("");
        return true;
    };

    const handleForgotPassword = async () => {
        if (!validateEmail(email)) return;
        const data = {
            email: email,
            lang: currentLanguage,
        };

        setLoading(true);
        try {
            await dispatch(forgotPasswordThunk(data)).unwrap();

            showDialog(
                t("auth.forgot_password.success_title"),
                t("auth.forgot_password.success_description"),
                "success"
            );
        } catch (error: any) {
            showDialog(
                t("auth.forgot_password.error_title"),
                error || t("auth.forgot_password.error_description"),
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <ImageBackground
                source={require("@/assets/images/authen/img_bg_authen.png")}
                style={{ flex: 1 }}
            >
                <View paddingT-48 centerH marginB-12>
                    <Image
                        source={Brand}
                        style={{ width: width * 0.6, height: height * 0.1 }}
                    />
                    <View width={"80%"}>
                        <Text
                            onboarding_title={currentLanguage !== "ja"}
                            onboarding_title_ja={currentLanguage === "ja"}
                        >
                            {t("auth.art.title")}
                        </Text>
                        <View right>
                            <Text
                                onboarding_title={currentLanguage !== "ja"}
                                onboarding_title_ja={currentLanguage === "ja"}
                            >
                                {t("auth.art.subtitle")}
                            </Text>
                        </View>
                    </View>
                </View>
                <Animated.View
                    style={{
                        backgroundColor: "white",
                        width: "100%",
                        paddingHorizontal: 24,
                        paddingTop: 32,
                        position: "absolute",
                        bottom: 0,
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                    }}
                >
                    <View
                        style={{
                            width: "100%",
                            justifyContent: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 24,
                                color: Colors.text,
                                fontWeight: "bold",
                                width: "100%",
                                flexWrap: "wrap",
                                marginBottom: 12,
                            }}
                        >
                            {t("auth.forgot_password.title")}
                        </Text>
                        <Text
                            style={{
                                fontSize: 16,
                                color: Colors.grey30,
                                marginBottom: 12,
                            }}
                        >
                            {t("auth.forgot_password.description")}
                        </Text>

                        <View style={{ width: "100%" }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    color: Colors.text,
                                    fontWeight: "600",
                                    marginBottom: 12,
                                }}
                            >
                                {t("auth.forgot_password.email")}
                            </Text>
                            <TextInput
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    validateEmail(text);
                                }}
                                placeholder={t("auth.forgot_password.email_placeholder")}
                                keyboardType="email-address"
                                onBlur={() => validateEmail(email)}
                            />
                            {emailError ? (
                                <Text
                                    style={{
                                        color: Colors.red30,
                                        marginTop: 8,
                                        fontSize: 14,
                                        marginLeft: 4,
                                    }}
                                >
                                    {emailError}
                                </Text>
                            ) : (
                                <Text
                                    style={{
                                        fontSize: 14,
                                        color: Colors.grey30,
                                        marginTop: 8,
                                        marginLeft: 4,
                                        lineHeight: 20,
                                    }}
                                >
                                    {t("auth.forgot_password.email_hint")}
                                </Text>
                            )}
                            <View marginT-20>
                                <AppButton
                                    title={t("continue")}
                                    type="primary"
                                    onPress={handleForgotPassword}
                                    loading={loading}
                                    disabled={loading || !!emailError}

                                />
                            </View>
                            <View marginT-12 marginB-32>
                                <AppButton
                                    title={t("back")}
                                    type="outline"
                                    onPress={() => router.back()}
                                    disabled={loading}
                                />
                            </View>
                        </View>
                    </View>

                    <AppDialog
                        visible={dialogConfig.visible}
                        title={dialogConfig.title}
                        description={dialogConfig.description}
                        severity={dialogConfig.severity}
                        onClose={hideDialog}
                        closeButton={true}
                        onConfirm={() => {
                            router.replace("/(auth)/");
                        }}
                        confirmButton={true}
                    />
                </Animated.View>
            </ImageBackground>
        </KeyboardAvoidingView>
    );
}
