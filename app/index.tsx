import { Redirect } from 'expo-router';
import { Link } from 'expo-router';
import { View } from 'react-native-ui-lib';
import Example_ChangeLanguage from './example-changeLanguage/example_changeLanguage';

// This file index.tsx is used to redirect the user to the /(tabs) route
export default function Index() {
  
  return (
    // <Redirect href="/(tabs)" />;
    
    <View style={{ flex: 1 }}>
      <Example_ChangeLanguage />
    </View>
  )
}
