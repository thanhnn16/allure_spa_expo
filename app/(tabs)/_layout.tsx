import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const TabsLayout: React.FC = () => {
  return (
    <Tabs initialRouteName="home/index" screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="store/index"
        options={{
          title: 'Cửa hàng',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="storefront-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scheduled/index"
        options={{
          title: 'Lịch hẹn',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Tài khoản',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/setting/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/address/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/aboutapp/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/detail/index"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="profile/detail/edit"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
