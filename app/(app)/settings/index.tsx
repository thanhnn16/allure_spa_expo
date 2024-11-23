import React, { useState } from "react";
import {
  View,
  Text,
  Switch,
  Colors,
  RadioGroup,
  RadioButton,
  Card,
} from "react-native-ui-lib";
import Ionicons from "@expo/vector-icons/Ionicons";
import AppBar from "@/components/app-bar/AppBar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useLanguage } from "@/hooks/useLanguage";
import { setI18nConfig } from "@/languages/i18n";
import { setLanguage } from "@/redux/features/language/languageSlice";
import { router } from "expo-router";

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(
    (state: RootState) => state.language.currentLanguage
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const { t } = useLanguage();

  const languageOptions = [
    { label: "Tiếng Việt", value: "vi" },
    { label: "English", value: "en" },
    { label: "日本語", value: "ja" },
  ];

  const handleLanguageChange = async (value: string) => {
    try {
      setI18nConfig(value);
      dispatch(setLanguage(value));
      router.replace("/");
    } catch (error) {
      console.error("Error changing language:", error);
    }
  };

  return (
    <View flex bg-$white>
      <AppBar title={t("settings.title")} back />
      <View flex paddingH-20 paddingT-12>
        {/* Language Section */}
        <Card marginB-20 padding-15 borderRadius={10} bg-grey80>
          <View row centerV marginB-15>
            <Ionicons name="language" size={24} color={Colors.grey30} />
            <Text marginL-10 text70 color={Colors.grey10}>
              {t("settings.language")}
            </Text>
          </View>

          <RadioGroup
            initialValue={currentLanguage}
            onValueChange={handleLanguageChange}
          >
            {languageOptions.map((option) => (
              <View key={option.value} row spread centerV paddingV-8>
                <Text
                  text80
                  color={
                    currentLanguage === option.value
                      ? Colors.grey10
                      : Colors.grey30
                  }
                >
                  {option.label}
                </Text>
                <RadioButton
                  value={option.value}
                  selected={currentLanguage === option.value}
                  color={Colors.grey10}
                />
              </View>
            ))}
          </RadioGroup>
        </Card>

        {/* Dark Mode Section */}
        <Card
          row
          spread
          centerV
          padding-15
          marginB-20
          borderRadius={10}
          bg-grey80
        >
          <View row centerV>
            <Ionicons name="moon" size={24} color={Colors.grey30} />
            <Text marginL-10 text70 color={Colors.grey10}>
              {t("settings.darkMode")}
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            offColor={Colors.grey50}
            onColor={Colors.blue30}
          />
        </Card>

        {/* Notifications Section */}
        <Card
          row
          spread
          centerV
          padding-15
          marginB-20
          borderRadius={10}
          bg-grey80
        >
          <View row centerV>
            <Ionicons name="notifications" size={24} color={Colors.grey30} />
            <Text marginL-10 text70 color={Colors.grey10}>
              {t("settings.notifications")}
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            offColor={Colors.grey50}
            onColor={Colors.blue30}
          />
        </Card>
      </View>
    </View>
  );
};

export default SettingsScreen;
