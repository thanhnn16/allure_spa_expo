import { Redirect } from 'expo-router';
import { Link } from 'expo-router';
import { Colors, View } from 'react-native-ui-lib';
import ChangeLanguageExample from './example-changeLanguage/change_language_example';
import { StatusBar } from 'react-native';

export default function Index() {
  
  return (
    <Redirect href="/(tabs)/(home)" /> 
  )
}

