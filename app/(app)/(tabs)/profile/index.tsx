import ArrowRight from "@/assets/icons/arrow.svg";
import { View, Text, Card, Image, TouchableOpacity } from "react-native-ui-lib";
import { useAuth } from "@/hooks/useAuth";
import { SafeAreaView } from "react-native-safe-area-context";
import i18n from "@/languages/i18n";
import { Href, router } from "expo-router";
import { useState } from "react";
import AppDialog from "@/components/dialog/AppDialog";
import { ScrollView } from "react-native";

const ProfilePage = () => {
  const { user, signOut, signOutGuest, isGuest } = useAuth();
  const [loginDialogVisible, setLoginDialogVisible] = useState(false);

  const handleSignOut = () => {
    isGuest ? signOutGuest() : signOut();
  };

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
                <Text text60>{user?.full_name || i18n.t("common.guest")}</Text>
                <Text>{user?.phone_number || ""}</Text>
              </View>
            </View>
            <View gap-10 center>
              <View row gap-5>
                <Image
                  width={20}
                  height={20}
                  source={require("@/assets/images/allureCoin.png")}
                />
                <Text white>{user?.loyalty_points || 0}</Text>
              </View>

              <TouchableOpacity
                center
                backgroundColor="#FFFFFF"
                style={{
                  borderRadius: 10,
                  width: 48,
                  height: 29,
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
                title: i18n.t("profile.my_account"),
                description: i18n.t("profile.edit_personal_info"),
                icon: require("@/assets/images/people.png"),
                onPress: () => handleNavigation("/(app)/profile/detail"),
              },
              {
                title: i18n.t("pageTitle.order"),
                description: i18n.t("pageTitle.order_description"),
                icon: require("@/assets/images/ic_favorite.png"),
                onPress: () => handleNavigation("/(app)/orders"),
              },
              {
                title: i18n.t("pageTitle.favorite"),
                description: i18n.t("pageTitle.favorite_description"),
                icon: require("@/assets/images/heart.png"),
                onPress: () => handleNavigation("/(app)/favorite"),
              },
              {
                title: i18n.t("profile.purchase_policy"),
                description: i18n.t("profile.policy_description"),
                icon: require("@/assets/images/chamhoi.png"),
                onPress: () => console.log("Purchase Policy"),
              },
              {
                title: i18n.t("profile.order_address"),
                description: i18n.t("profile.address_list"),
                icon: require("@/assets/images/location.png"),
                onPress: () => handleNavigation("/(app)/address"),
              },
              {
                title: isGuest
                  ? i18n.t("auth.login.login_now")
                  : i18n.t("profile.logout"),
                description: "",
                icon: require("@/assets/images/logout.png"),
                onPress: handleSignOut,
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
                    {item.description ? (
                      <Text gray>{item.description}</Text>
                    ) : null}
                  </View>
                  <Image source={ArrowRight} />
                </View>
              </TouchableOpacity>
            ))}
          </Card>
          <Text text80BO gray style={{ letterSpacing: 1 }} marginT-10>
            {i18n.t("profile.more")}
          </Text>
          <Card width={"100%"} marginT-20>
            {[
              {
                title: i18n.t("profile.help_support"),
                icon: require("@/assets/images/ring.png"),
                onPress: () => console.log("Help & Support"),
              },
              {
                title: i18n.t("profile.about_app"),
                icon: require("@/assets/images/heart.png"),
                onPress: () => handleNavigation("/profile/about-app", false),
              },
              {
                title: i18n.t("profile.settings"),
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
        title={i18n.t("auth.login.login_required")}
        description={i18n.t("auth.login.login_profile")}
        closeButtonLabel={i18n.t("common.cancel")}
        confirmButtonLabel={i18n.t("auth.login.login_now")}
        severity="info"
        onClose={() => setLoginDialogVisible(false)}
        onConfirm={handleLoginConfirm}
      />
    </View>
  );
};

export default ProfilePage;
