import { Redirect } from 'expo-router';
import { Link } from 'expo-router';
import { View } from 'react-native-ui-lib';
import ChangeLanguageExample from './example-changeLanguage/change_language_example';

// This file index.tsx is used to redirect the user to the /(tabs) route
export default function Index() {
  
  return (
    <Redirect href="/(tabs)/(home)" /> 
  )
}

