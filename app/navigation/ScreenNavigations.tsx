import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Login, Register, FlashScreen, Onboard, Address,UpdateAddress } from '../authen';
// import { UpdateAddress } from '../authen/pages/UpdateAddress';

const Stack = createNativeStackNavigator();

const AuthenNavigations = () => {
  return (
    <Stack.Navigator 
      initialRouteName="FlashScreen"
      screenOptions={{ headerShown: false }} // Hide header bar by default
    >
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={{ 
          title: 'Login',
          headerShown: true, // Show header bar for this screen
          headerBackTitle: '' // Hide back button text
        }} 
      />
      <Stack.Screen 
        name="Register" 
        component={Register} 
        options={{ 
          title: 'Register',
          headerShown: true, // Show header bar for this screen
          headerBackTitle: '' // Hide back button text
        }} 
      />
      <Stack.Screen 
        name="FlashScreen" 
        component={FlashScreen} 
        options={{ 
          title: 'Flash Screen',
          headerShown: true, // Show header bar for this screen
          headerBackTitle: '' // Hide back button text
        }} 
      />
      <Stack.Screen 
        name="Onboard" 
        component={Onboard} 
        options={{ 
          title: 'Onboard',
          headerShown: true, // Show header bar for this screen
          headerBackTitle: '' // Hide back button text
        }} 
      />
      <Stack.Screen 
        name="Address" 
        component={Address} 
        options={{ 
          title: 'Address',
          headerShown: true, // Show header bar for this screen
          headerBackTitle: '' // Hide back button text
        }} 
      />
      <Stack.Screen 
          name="UpdateAddress" 
          component={UpdateAddress} 
          options={{ 
            title: 'Update Address',
            headerShown: true, // Show header bar for this screen
            headerBackTitle: '' // Hide back button text
          }} 
        />
    </Stack.Navigator>
  );
};

const ScreenNavigations = () => {
  return <AuthenNavigations />;
};

export default ScreenNavigations;

const styles = StyleSheet.create({});