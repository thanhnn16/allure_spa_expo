import React from "react";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Dimensions } from "react-native";
import Color from "@/constants/Colors";

const TabLayout: React.FC = () => {
  const screenWidth = Dimensions.get("window").width;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: 76,
          width: screenWidth,
          paddingHorizontal: 24,
        },
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
      <Tabs.Screen name="chat/ai_screen" options={{ href: null }} />
      <Tabs.Screen name="chat/ai_voice_screen" options={{ href: null }} />
      <Tabs.Screen name="chat/message_screen" options={{ href: null }} />
      <Tabs.Screen name="chat/message_ai" options={{ href: null }} />
      <Tabs.Screen name="chat/data" options={{ href: null }} />
      <Tabs.Screen name="profile/detail" options={{ href: null }} />
      <Tabs.Screen name="profile/edit" options={{ href: null }} />
      <Tabs.Screen name="profile/address/index" options={{ href: null }} />
      <Tabs.Screen name="profile/about-app" options={{ href: null }} />
    </Tabs>
  );
};

export default TabLayout;
