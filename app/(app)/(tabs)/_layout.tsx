import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import Color from "@/constants/Colors";

const TabLayout: React.FC = () => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <Tabs
      backBehavior="history"
      initialRouteName={"home/index"}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 76,
          width: screenWidth,
          paddingHorizontal: 24,
        },
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: "Trang chủ",
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={size}
              color={Color.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat/index"
        options={{
          title: "Chat",
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "chatbubble" : "chatbubble-outline"}
              size={size}
              color={Color.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="appointment/index"
        options={{
          title: "Lịch hẹn",
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={size}
              color={Color.primary}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: "Tài khoản",
          tabBarLabel: () => null,
          tabBarIcon: ({ focused, size }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={size}
              color={Color.primary}
            />
          ),
        }}
      />
      <Tabs.Screen name="profile/detail" options={{ href: null }} />
      <Tabs.Screen name="profile/edit" options={{ href: null }} />
      <Tabs.Screen name="profile/address/index" options={{ href: null }} />
      <Tabs.Screen name="profile/address/add" options={{ href: null }} />
      <Tabs.Screen name="profile/address/update" options={{ href: null }} />
      <Tabs.Screen name="profile/about-app" options={{ href: null }} />
      <Tabs.Screen name="profile/delete-account" options={{ href: null }} />
      <Tabs.Screen name="profile/delete-account-verify" options={{ href: null }} />
    </Tabs>
  );
};

export default TabLayout;