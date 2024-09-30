import { Redirect } from 'expo-router';
import { Link } from 'expo-router';
import { Colors, View } from 'react-native-ui-lib';
import ChangeLanguageExample from './example-changeLanguage/change_language_example';
import { StatusBar } from 'react-native';

// This file index.tsx is used to redirect the user to the /(tabs) route
export default function Index() {
  
  return (
    <View>
      <StatusBar backgroundColor={Colors.transparent}/>
      <Redirect href="/authen/otp" /> 
    </View>
  )
}

