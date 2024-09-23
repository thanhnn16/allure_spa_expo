import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Login, Register, FlashScreen, Onboard } from '../authen';
import Home from '../(tabs)/_layout';

const Stack = createNativeStackNavigator();

const AuthenNavigations = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="FlashScreen">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="FlashScreen" component={FlashScreen} />
      <Stack.Screen name="Onboard" component={Onboard} />
    </Stack.Navigator>
  );
};

const ScreenNavigations = () => {
  return <AuthenNavigations />;
};

export default ScreenNavigations;

const styles = StyleSheet.create({});