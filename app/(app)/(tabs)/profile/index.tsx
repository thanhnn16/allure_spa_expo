import ArrowRight from "@/assets/icons/arrow.svg";
import {
  View,
  Text,
  Card,
  Image,
  TouchableOpacity,
  Colors,
} from "react-native-ui-lib";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";

import { Href, router } from "expo-router";
import { useState } from "react";
import AppDialog from "@/components/dialog/AppDialog";
import { ScrollView } from "react-native";
import VoucherIcon from "@/assets/icons/discount-shape.svg";

const ProfilePage = () => {
  const { t } = useLanguage();

  const { user, signOut, isGuest } = useAuth();
  const [loginDialogVisible, setLoginDialogVisible] = useState(false);

  const handleLoginConfirm = () => {
    setLoginDialogVisible(false);
    router.replace("/(auth)");
  };

  const handleNavigation = (path: Href<string>, showDialog: boolean = true) => {
    if (isGuest && showDialog) {
      setLoginDialogVisible(true);
    } else {
      // chuyển hướng tới trang theo path
      router.push(path);
    }
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
                borderRadius={50}
                source={
                  user?.avatar_url
                    ? { uri: user.avatar_url }
                    : require("@/assets/images/logo/logo.png")
                }
              />
              <View>
                <Text h2_bold>{user?.full_name || t("common.guest")}</Text>
                <Text h3>{user?.phone_number || ""}</Text>
              </View>
            </View>
            <View gap-6 center>
              <View row gap-4 centerV>
                <Text color={Colors.primary} h3_bold>
                  {user?.loyalty_points || 0}
                </Text>
                <Image
                  width={16}
                  height={16}
                  marginB-2
                  source={require("@/assets/images/allureCoin.png")}
                />
              </View>

              <TouchableOpacity
                center
                backgroundColor="#FFFFFF"
                style={{
                  borderRadius: 10,
                  width: 48,
                  height: 32,
                  elevation: 5,
                }}
                onPress={() => {
                  router.push("/(app)/reward");
                }}
              >
                <Image
                  width={20}
                  height={20}
                  source={require("@/assets/images/gift.png")}
                />
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
                  <TouchableOpacity
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
                  </TouchableOpacity>
                  <View flex gap-5>
                    <Text h3_bold>{item.title}</Text>
                    {item.description ? (
                      <Text h3 gray>
                        {item.description}
                      </Text>
                    ) : null}
                  </View>
                  <Image source={ArrowRight} />
                </View>
              </TouchableOpacity>
            ))}
          </Card>
          <Text text80BO gray style={{ letterSpacing: 1 }} marginT-10>
            {t("profile.more")}
          </Text>
          <Card width={"100%"} marginT-20>
            {[
              {
                title: t("profile.purchase_policy"),
                icon: require("@/assets/images/chamhoi.png"),
                onPress: () => console.log("Purchase Policy"),
              },
              {
                title: t("profile.help_support"),
                icon: require("@/assets/images/ring.png"),
                onPress: () => console.log("Help & Support"),
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
                  <TouchableOpacity
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
                  </TouchableOpacity>
                  <View flex gap-5>
                    <Text text70BL>{item.title}</Text>
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
