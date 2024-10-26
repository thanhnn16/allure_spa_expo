import React from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native-ui-lib';

import HomeIcon from '@/assets/icons/home.svg';
import ChatIcon from '@/assets/icons/message_2.svg';
import CalendarIcon from '@/assets/icons/appointment.svg';
import ProfileIcon from '@/assets/icons/profile.svg';

const TabsLayout: React.FC = () => {
  return (
    <Tabs
      initialRouteName="home/index" 
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen
        name="home/index"
        options={{
          title: 'Trang chủ',
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Image source={HomeIcon} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat/index"
        options={{
          title: 'Chat',
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Image source={ChatIcon} />
          ),
        }}
      />
      <Tabs.Screen
        name="scheduled/index"
        options={{
          title: 'Lịch hẹn',
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Image source={CalendarIcon} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile/index"
        options={{
          title: 'Tài khoản',
          tabBarLabel: () => null,
          tabBarIcon: ({ color, size }) => (
            <Image source={ProfileIcon} />
          ),
        }}
      />
      {/* <Tabs.Screen
        name="profile/setting/index"
        options={{
          href: null,
        }}
      /> */}
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
