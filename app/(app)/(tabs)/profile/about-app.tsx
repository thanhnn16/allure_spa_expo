import react from "react";
import { useFonts } from "expo-font";
import i18n from "@/languages/i18n";

import { View, Text, Image, TouchableOpacity } from "react-native-ui-lib";
import BackButton from "@/assets/icons/back.svg";
import { router, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import AppBar from "@/components/app-bar/AppBar";
import * as Application from "expo-application";
import { ScrollView } from "react-native";

interface AboutAppProps {}

const AboutApp = () => {
  const appName = Application.applicationName;
  const appVersion = Application.nativeApplicationVersion;
  const buildVersion = Application.nativeBuildVersion;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <AppBar back title={i18n.t("aboutapp.title")} />
      <ScrollView>
        <View paddingH-24 paddingV-20 flex>
          <View center>
            <Image
              width={128}
              height={128}
              borderRadius={50}
              source={require("@/assets/images/logo/logo.png")}
            />
          </View>

          <View>
            <Text text80BL>{i18n.t("aboutapp.title1")}</Text>
            <Text marginT-20 text70BL>
              {i18n.t("aboutapp.title2")}
            </Text>
            <Text marginT-20 text70BL>
              - {i18n.t("aboutapp.name_app")}: {appName}
            </Text>
            <Text marginT-20 text70BL>
              - {i18n.t("aboutapp.version")}: {appVersion} ({buildVersion})
            </Text>
            <Text marginT-20 text70BL>
              - {i18n.t("aboutapp.developer")}: Ong Lười
            </Text>
            <Text marginT-20 text70BL>
              - {i18n.t("aboutapp.date_release")}: 2024
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AboutApp;
