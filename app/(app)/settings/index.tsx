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
import i18n from "@/languages/i18n";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { setLanguage } from "@/redux/features/language/languageSlice";

const SettingsScreen: React.FC = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector(
    (state: RootState) => state.language.currentLanguage
  );
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const languageOptions = [
    { label: "Tiếng Việt", value: "vi" },
    { label: "English", value: "en" },
    { label: "日本語", value: "ja" },
  ];

  const handleLanguageChange = async (value: string) => {
    dispatch(setLanguage(value));
  };

  return (
    <View flex bg-$white>
      <AppBar title={i18n.t("settings.title")} back />
      <View flex paddingH-20 paddingT-12>
        {/* Language Section */}
        <Card marginB-20 padding-15 borderRadius={10} bg-grey80>
          <View row centerV marginB-15>
            <Ionicons name="language" size={24} color={Colors.grey30} />
            <Text marginL-10 text70 color={Colors.grey10}>
              {i18n.t("settings.language")}
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
              {i18n.t("settings.darkMode")}
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
              {i18n.t("settings.notifications")}
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
