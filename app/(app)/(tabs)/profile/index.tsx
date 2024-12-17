import ArrowRight from "@/assets/icons/arrow.svg";
import {
  View,
  Text,
  Card,
  Image,
  TouchableOpacity,
  Colors,
  Hint,
} from "react-native-ui-lib";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

import { Href, router } from "expo-router";
import { useEffect, useState, useRef } from "react";
import AppDialog from "@/components/dialog/AppDialog";
import { Linking, ScrollView, Animated } from "react-native";
import VoucherIcon from "@/assets/icons/discount-shape.svg";
import { getUserThunk } from "@/redux/features/users/getUserThunk";
import { useDispatch } from "react-redux";
import * as MailComposer from "expo-mail-composer";
import { Ionicons } from '@expo/vector-icons';

const ProfilePage = () => {
  const { t } = useLanguage();
  const dispatch = useDispatch();
  const { user, signOut, isGuest } = useAuth();
  const [loginDialogVisible, setLoginDialogVisible] = useState(false);
  const [showVerificationHint, setShowVerificationHint] = useState(false);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const shineAnim = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const pulseAnimation = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(shineAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(shineAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  useEffect(() => {
    const interval = setInterval(() => {
      pulseAnimation();
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLoginConfirm = () => {
    setLoginDialogVisible(false);
    signOut();
  };

  useEffect(() => {
    dispatch(getUserThunk());
  }, [dispatch]);

  const handleNavigation = (path: Href<string>, showDialog: boolean = true) => {
    if (isGuest && showDialog) {
      setLoginDialogVisible(true);
    } else {
      // chuyển hướng tới trang theo path
      router.push(path);
    }
  };

  const handleSentEmail = () => {
    return MailComposer.composeAsync({
      subject: "Help & Support Allure Spa",
      body: "Please describe your problem or question here:",
      recipients: ["thanhnn16.work@gmail.com"],
    });
  };

  const needsVerification = user && (!user.phone_verified_at || !user.email_verified_at);

  const getVerificationMessage = () => {
    if (!user) return "";
    const messages = [];
    if (!user.phone_verified_at) {
      messages.push(t("profile.phone_not_verified"));
    }
    if (!user.email_verified_at) {
      messages.push(t("profile.email_not_verified"));
    }
    return messages.join("\n");
  };

  return (
    <View flex bg-$white>
      <ScrollView>
        <View flex paddingH-24 marginV-10>
          <Card
            width={"100%"}
            height={100}
            row
            elevation={5}
            centerV
            gap-15
            spread
            borderRadius={20}
            backgroundColor={"#D5D6CD"}
            paddingH-20
          >
            <View row centerV gap-10>
              <Image
                width={64}
                height={64}
                center
                style={{ borderRadius: 100 }}
                errorSource={require("@/assets/images/logo/logo.png")}
                source={
                  user?.avatar_url
                    ? { uri: user.avatar_url }
                    : require("@/assets/images/logo/logo.png")
                }
              />
              <View>
                <Text h3_bold>{user?.full_name || t("common.guest")}</Text>
                <View row gap-4 centerV>
                  <Image
                    width={16}
                    height={16}
                    marginB-2
                    source={require("@/assets/images/allureCoin.png")}
                  />
                  <Text color={Colors.primary} h3_bold>
                    {user?.loyalty_points || 0}
                  </Text>
                </View>
              </View>
            </View>
            <View gap-6 center>
              <TouchableOpacity
                center
                onPress={() => {
                  pulseAnimation();
                  router.push("/(app)/reward");
                }}
              >
                <Animated.View
                  style={{
                    transform: [{ scale: scaleAnim }],
                    backgroundColor: Colors.surface,
                    borderRadius: 12,
                    width: 56,
                    height: 40,
                    justifyContent: "center",
                    alignItems: "center",
                    elevation: 8,
                    shadowColor: Colors.primary,
                    shadowOffset: {
                      width: 0,
                      height: 4,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 4.5,
                    overflow: "hidden",
                    borderWidth: 1.5,
                    borderColor: Colors.primary_light,
                  }}
                >
                  <Animated.View
                    style={{
                      position: 'absolute',
                      top: -5,
                      left: -5,
                      right: -5,
                      bottom: -5,
                      borderRadius: 16,
                      backgroundColor: Colors.primary,
                      opacity: glowAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 0.2],
                      }),
                    }}
                  />
                  <Animated.View
                    style={{
                      width: "150%",
                      height: "100%",
                      position: "absolute",
                      backgroundColor: Colors.primary,
                      opacity: 0.15,
                      transform: [
                        {
                          translateX: shineAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-84, 84],
                          }),
                        },
                        {
                          skewX: "-25deg",
                        },
                      ],
                    }}
                  />
                  <Image
                    width={28}
                    height={28}
                    source={require("@/assets/images/gift.png")}
                    tintColor={Colors.primary}
                  />
                </Animated.View>
              </TouchableOpacity>
            </View>
          </Card>
          <Card width={"100%"} marginT-20>
            {[
              {
                title: t("profile.my_account"),
                description: t("profile.edit_personal_info"),
                icon: require("@/assets/images/people.png"),
                onPress: () => handleNavigation("/(app)/profile/detail"),
                showWarning: needsVerification,
              },
              {
                title: t("profile.service_package"),
                description: t("profile.service_package_description"),
                icon: require("@/assets/images/service-package.png"),
                onPress: () => handleNavigation("/(app)/service-package"),
              },
              {
                title: t("pageTitle.order"),
                description: t("pageTitle.order_description"),
                icon: require("@/assets/images/ic_favorite.png"),
                onPress: () => handleNavigation("/(app)/order"),
              },
              {
                title: t("pageTitle.favorite"),
                description: t("pageTitle.favorite_description"),
                icon: require("@/assets/images/heart.png"),
                onPress: () => handleNavigation("/(app)/favorite"),
              },
              {
                title: t("profile.voucher"),
                description: t("profile.voucher_description"),
                icon: VoucherIcon,
                onPress: () => handleNavigation("/(app)/voucher"),
              },
              {
                title: t("profile.order_address"),
                description: t("profile.address_list"),
                icon: require("@/assets/images/location.png"),
                onPress: () => handleNavigation("/(app)/address"),
              },
              {
                title: isGuest
                  ? t("auth.login.login_now")
                  : t("profile.logout"),
                description: "",
                icon: require("@/assets/images/logout.png"),
                onPress: signOut,
              },
            ].map((item, index) => (
              <TouchableOpacity key={index} onPress={item.onPress}>
                <View row padding-10 gap-20 center>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image source={item.icon} width={24} height={24} />
                  </View>
                  <View flex gap-5>
                    <Text h3_bold>{item.title}</Text>
                    {item.description ? (
                      <Text h3 gray>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  <View row centerV>
                    {item.showWarning && (
                      <Hint
                        visible={showVerificationHint}
                        message={getVerificationMessage()}
                        color={Colors.red30}
                        onBackgroundPress={() => setShowVerificationHint(false)}
                        position={Hint.positions.BOTTOM}
                      >
                        <TouchableOpacity
                          onPress={() => setShowVerificationHint(true)}
                          marginR-8
                        >
                          <Ionicons
                            name="warning"
                            size={20}
                            color={Colors.red30}
                          />
                        </TouchableOpacity>
                      </Hint>
                    )}
                    <Image source={ArrowRight} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </Card>
          <Text h2_bold gray marginT-18>
            {t("profile.more")}
          </Text>
          <Card width={"100%"} marginT-12>
            {[
              {
                title: t("profile.purchase_policy"),
                icon: require("@/assets/images/chamhoi.png"),
                onPress: () => router.push("/(app)/profile/policy"),
              },
              {
                title: t("profile.help_support"),
                icon: require("@/assets/images/ring.png"),
                onPress: () => handleSentEmail(),
              },
              {
                title: t("profile.about_app"),
                icon: require("@/assets/images/heart.png"),
                onPress: () => handleNavigation("/profile/about-app", false),
              },
              {
                title: t("profile.settings"),
                icon: require("@/assets/images/setting.png"),
                onPress: () => handleNavigation("/settings", false),
              },
            ].map((item, index) => (
              <TouchableOpacity key={index} onPress={item.onPress}>
                <View row padding-10 gap-20 center>
                  <View
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 50,
                      backgroundColor: "#F7F7F7",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Image source={item.icon} width={24} height={24} />
                  </View>
                  <View flex gap-5>
                    <Text h3_bold>{item.title}</Text>
                  </View>
                  <Image source={ArrowRight} />
                </View>
              </TouchableOpacity>
            ))}
          </Card>
        </View>
      </ScrollView>
      <AppDialog
        visible={loginDialogVisible}
        title={t("auth.login.login_required")}
        description={t("auth.login.login_profile")}
        closeButtonLabel={t("common.cancel")}
        confirmButtonLabel={t("auth.login.login_now")}
        severity="info"
        onClose={() => setLoginDialogVisible(false)}
        onConfirm={handleLoginConfirm}
      />
    </View>
  );
};

export default ProfilePage;
