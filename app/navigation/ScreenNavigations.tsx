import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { Login, Register, FlashScreen } from '../authen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthenNavigations = () => {
    return (
        <Stack.Navigator screenOptions={{headerShown: false}} initialRouteName='FlashScreen'>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="FlashScreen" component={FlashScreen} />
        </Stack.Navigator>
    )
}

const ScreenNavigations = () => {
  return (
      <AuthenNavigations/>
  )
}

export default ScreenNavigations

const styles = StyleSheet.create({})