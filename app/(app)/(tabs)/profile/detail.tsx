import React from "react";
import { View, Text, TouchableOpacity, Image, Card } from "react-native-ui-lib";
import BackButton from "@/assets/icons/back.svg";
import ArrowRight from "@/assets/icons/arrow.svg";
import i18n from "@/languages/i18n";
import { useAuth } from "@/hooks/useAuth";
import { router } from "expo-router";
import AppBar from "@/components/app-bar/AppBar";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileDetailProps {}

const ProfileDetail = (props: ProfileDetailProps) => {
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <AppBar back title={i18n.t("profile.title")} />
      <View flex paddingH-24>
        <View center marginT-30 gap-7>
          <Image
            width={76}
            height={76}
            borderRadius={50}
            style={{ borderColor: "#D5D6CD", borderWidth: 2 }}
            source={
              user?.avatar_url
                ? { uri: user.avatar_url }
                : require("@/assets/images/avt.png")
            }
          />
          <Text text60>{user?.full_name || i18n.t("profile.username")}</Text>
          <Text gray>{user?.phone_number || ""}</Text>
        </View>
        <Card width={"100%"} marginT-20>
          {[
            {
              title: i18n.t("profile.edit_profile"),
              icon: require("@/assets/images/edit.png"),
              onPress: () => {
                router.push("/(app)/(tabs)/profile/edit");
              },
            },
            {
              title: i18n.t("profile.change_password"),
              icon: require("@/assets/images/key.png"),
              onPress: () => {
                console.log("đổi mật khẩu");
              },
            },
            {
              title: i18n.t("profile.history_login"),
              icon: require("@/assets/images/global.png"),
              onPress: () => {
                console.log("Lịch sử đăng nhập");
              },
            },
            {
              title: i18n.t("profile.dowload_information"),

              icon: require("@/assets/images/dowload.png"),
              onPress: () => {
                console.log("download");
              },
            },
            {
              title: i18n.t("profile.delete_account"),
              icon: require("@/assets/images/deleteacount.png"),
              onPress: () => {
                console.log("xóa tài khoản");
              },
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
    </SafeAreaView>
  );
};

export default ProfileDetail;
