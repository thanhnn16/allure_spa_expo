import { router } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
  View,
  Text,
  Switch,
  Colors,
  RadioGroup,
  RadioButton,
  Button,
} from "react-native-ui-lib";
import Ionicons from "@expo/vector-icons/Ionicons";

const SettingsScreen: React.FC = () => {
  const [language, setLanguage] = useState("Tiếng Việt");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerWrapper}>
          <Button
            iconSource={require("@/assets/images/home/arrow_ios.png")}
            onPress={() => router.back()}
            link
            style={styles.headerBackButton}
            iconStyle={{ tintColor: "black" }}
          />
          <Text style={styles.headerTitle}>Cài đặt</Text>
        </View>

        {/* Language Section */}
        <View style={styles.section}>
          <View row centerV marginB-15>
            <Ionicons name="language" size={24} color={Colors.grey30} />
            <Text marginL-10 text70 color={Colors.grey10}>
              Ngôn ngữ
            </Text>
          </View>

          <RadioGroup
            initialValue={language}
            onValueChange={(value: string) => setLanguage(value)}
          >
            {["Tiếng Việt", "English", "日本語"].map((lang) => (
              <View key={lang} style={styles.languageOption}>
                <Text
                  text80
                  color={language === lang ? Colors.grey10 : Colors.grey30}
                >
                  {lang}
                </Text>
                <RadioButton
                  value={lang}
                  selected={language === lang}
                  color={Colors.grey10}
                />
              </View>
            ))}
          </RadioGroup>
        </View>

        {/* Dark Mode Section */}
        <View style={[styles.section, styles.row]}>
          <View row centerV marginB-15>
            <Ionicons name="moon" size={24} color={Colors.grey30} />
            <Text marginL-10 text70 color={Colors.grey10}>
              Chế độ tối
            </Text>
          </View>
          <Switch
            value={isDarkMode}
            onValueChange={setIsDarkMode}
            offColor={Colors.grey50}
            onColor={Colors.blue30}
          />
        </View>

        {/* Notifications Section */}
        <View style={[styles.section, styles.row]}>
          <View row centerV marginB-15>
            <Ionicons name="notifications" size={24} color={Colors.grey30} />
            <Text marginL-10 text70 color={Colors.grey10}>
              Thông báo
            </Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            offColor={Colors.grey50}
            onColor={Colors.blue30}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    backgroundColor: Colors.grey80,
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 20, // Thêm khoảng cách 20 cho header
  },
  headerBackButton: {
    marginRight: 16,
  },
  headerBackIcon: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 85,
  },
});

export default SettingsScreen;
