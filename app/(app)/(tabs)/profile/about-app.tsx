import react from "react";
import { Redirect } from "expo-router";
import { useFonts } from "expo-font";
import i18n from "@/languages/i18n";

import {
  View,
  Text,
  Card,
  Image,
  TouchableOpacity,
  ScrollBar,
} from "react-native-ui-lib";
import { Href, Link } from "expo-router";
import colors from "@/constants/Colors";
import BackButton from "@/assets/icons/back.svg";
import { router, useNavigation } from "expo-router";

interface AboutAppProps {}

const AboutApp = () => {
  return (
    <View flex marginH-20 marginT-40 useSafeArea>
      <View row centerV>
        <TouchableOpacity
          onPress={() => {
            router.back();
          }}
        >
          <Image width={30} height={30} source={BackButton} />
        </TouchableOpacity>
        <View flex center>
          <Text
            text60BO
            marginR-30
            style={{ color: "#717658", letterSpacing: 0.75 }}
          >
           {i18n.t("aboutapp.title")}
          </Text>
        </View>
      </View>
      <View center marginT-40>
        <Image
          width={300}
          height={300}
          borderRadius={50}
          source={require("@/assets/images/logo/logo.png")}
        />
      </View>

      <View width={"100%"} height={"100%"}>
        <Text text80BL>
         {i18n.t("aboutapp.title1")}
        </Text>
        <Text marginT-20 text70BL>
          {i18n.t("aboutapp.title2")}
        </Text>
        <Text marginT-20 text70BL>
          - {i18n.t("aboutapp.name_app")}
        </Text>
        <Text marginT-20 text70BL>
          - {i18n.t("aboutapp.version")}
        </Text>
        <Text marginT-20 text70BL>
          - {i18n.t("aboutapp.developer")}
        </Text>
        <Text marginT-20 text70BL>
          - {i18n.t("aboutapp.date_release")}
        </Text>
      </View>
    </View>           
  );
};

export default AboutApp;
