import React, { useRef, useState, useEffect } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Dimensions,
} from "react-native";
import { View, Image, Text } from "react-native-ui-lib";
import { useLanguage } from "@/hooks/useLanguage";

import LoginForm from "../../components/authentication/LoginForm";
import RegisterForm from "../../components/authentication/RegisterForm";
import LoginZaloForm from "../../components/authentication/LoginZaloForm";
import OTP from "./otp";
import AppButton from "@/components/buttons/AppButton";
import Brand from "@/assets/images/common/logo-brand.svg";
import LanguageModal from "@/components/modals/LanguageModal";
import { useAuth } from "@/hooks/useAuth";

const { width, height } = Dimensions.get("window");

const Onboarding: React.FC = () => {
  const { t, currentLanguage, changeLanguage } = useLanguage();

  const [activeView, setActiveView] = useState<
    "default" | "login" | "register" | "zalo" | "otp"
  >("default");

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const animateViewChange = (
    newView: "default" | "login" | "register" | "zalo" | "otp"
  ) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 10,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveView(newView);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleViewChange = (
    newView: "default" | "login" | "register" | "zalo" | "otp"
  ) => {
    animateViewChange(newView);
  };

  const updateLanguage = async (nextLanguage: string) => {
    await changeLanguage(nextLanguage);
    setModalVisible(false);
  };

  const toggleLanguageModal = () => {
    setModalVisible(!modalVisible);
  };

  const renderForm = () => {
    switch (activeView) {
      case "login":
        return <LoginForm onBackPress={() => handleViewChange("default")} />;
      case "register":
        return <RegisterForm onBackPress={() => handleViewChange("default")} />;
      case "zalo":
        return (
          <LoginZaloForm onBackPress={() => handleViewChange("default")} />
        );
      case "otp":
        return <OTP onBackPress={() => handleViewChange("default")} />;
      default:
        return null;
    }
  };

  const { signInAsGuest } = useAuth();

  const handleSkip = () => {
    signInAsGuest();
  };

  return (
    <View flex>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>
            <Image
              source={require("@/assets/images/authen/img_bg_authen.png")}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                opacity: 0.5,
              }}
            />
            <View paddingT-48 centerH marginB-16>
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
                opacity: fadeAnim,
                transform: [{ translateY: translateYAnim }],
                backgroundColor: "white",
                width: "100%",
                paddingHorizontal: 24,
                paddingTop: 32,
                paddingBottom: 20,
                position: "absolute",
                bottom: 0,
                borderTopLeftRadius: 30,
                borderTopRightRadius: 30,
              }}
            >
              {activeView === "default" ? (
                <View gap-12>
                  <AppButton
                    title={t("auth.register.title")}
                    type="primary"
                    onPress={() => handleViewChange("register")}
                  />
                  <AppButton
                    title={t("auth.login.title")}
                    type="primary"
                    onPress={() => handleViewChange("login")}
                  />
                  <AppButton
                    title={t("auth.login.zalo")}
                    type="outline"
                    onPress={() => handleViewChange("zalo")}
                  />
                  <AppButton
                    title={t("change_language")}
                    type="outline"
                    onPress={toggleLanguageModal}
                  />
                  <AppButton
                    title={t("auth.login.skip")}
                    type="text"
                    onPress={handleSkip}
                  />
                </View>
              ) : (
                renderForm()
              )}
              <Text center text80>
                {t("auth.login.by_continue")}
                <Text text80H> {t("auth.login.terms")} </Text>
                {t("auth.login.and")}
                <Text text80H> {t("auth.login.privacy")} </Text>
                {t("auth.login.of_us")}
              </Text>
            </Animated.View>
            <LanguageModal
              isVisible={modalVisible}
              onClose={toggleLanguageModal}
              onSelectLanguage={updateLanguage}
              currentLanguage={currentLanguage || ""}
            />
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Onboarding;
