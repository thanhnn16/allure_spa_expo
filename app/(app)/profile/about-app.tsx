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

  const data = [
    {
      title: t("aboutapp.section1"),
      content: t("aboutapp.content1")
    },
    {
      title: t("aboutapp.section2"),
      content: t("aboutapp.content2")
    },
    {
      title: t("aboutapp.section3"),
      content: t("aboutapp.content3")
    },
    {
      title: t("aboutapp.section4"),
      content: t("aboutapp.content4")
    },
    {
      title: t("aboutapp.section5"),
      content: t("aboutapp.content5")
    },
    {
      title: t("aboutapp.section6"),
      content: t("aboutapp.content6")
    },
    {
      title: t("aboutapp.section7"),
      content: t("aboutapp.content7")
    },
    {
      title: t("aboutapp.section8"),
      content: t("aboutapp.content8")
    }
  ]

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
            <Text h2>{t("aboutapp.title1")}</Text>

            <Text marginT-20 h2_bold>
              {t("aboutapp.title2")}
            </Text>
            <Text marginT-20 h2>
              - {t("aboutapp.name_app")}{appName}
            </Text>
            <Text marginT-20 h2>
              - {t("aboutapp.version")}{appVersion} ({buildVersion})
            </Text>
            <Text marginT-20 h2>
              - {t("aboutapp.developer")}Ong Lười
            </Text>
            <Text marginT-20 h2>
              - {t("aboutapp.date_release")}26/11/2024
            </Text>

            <Text marginT-20 h2_bold>{t("aboutapp.section2")}:</Text>
            {data.map((item, index) => (
              <View key={index} marginT-10>
                <Text h2>• <Text h2_bold>{item.title}: <Text h2>{item.content}</Text></Text></Text>

              </View>
            ))}

            <Text marginT-20 h2_bold>{t("aboutapp.why_choose")}</Text>
            <Text h2>{t("aboutapp.why_choose_content")}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AboutApp;
