import { useLanguage } from "@/hooks/useLanguage";


import { View, Text, Image } from "react-native-ui-lib";
import AppBar from "@/components/app-bar/AppBar";
import * as Application from "expo-application";
import { ScrollView } from "react-native";

interface AboutAppProps { }

const AboutApp = () => {
  const { t } = useLanguage();

  const appName = Application.applicationName;
  const appVersion = Application.nativeApplicationVersion;
  const buildVersion = Application.nativeBuildVersion;

  return (
    <View flex bg-white>
      <AppBar back title={t("aboutapp.title")} />
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
            <Text text80BL>{t("aboutapp.title1")}</Text>
            <Text marginT-20 text70BL>
              {t("aboutapp.title2")}
            </Text>
            <Text marginT-20 text70BL>
              - {t("aboutapp.name_app")}: {appName}
            </Text>
            <Text marginT-20 text70BL>
              - {t("aboutapp.version")}: {appVersion} ({buildVersion})
            </Text>
            <Text marginT-20 text70BL>
              - {t("aboutapp.developer")}: Ong Lười
            </Text>
            <Text marginT-20 text70BL>
              - {t("aboutapp.date_release")}: 2024
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutApp;
