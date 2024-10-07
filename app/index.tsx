import { Redirect } from 'expo-router';
import { Link } from 'expo-router';
import { Colors, View } from 'react-native-ui-lib';
import ChangeLanguageExample from './example-changeLanguage/change_language_example';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import ProfilePage from './Profile';
import ProfileDetail from './Profile/profile_detail';
import ProfileEdit from './Profile/profile_edit';
import ChangePassword from './authen/changePassword';

export default function Index() {
  const [loaded, error] = useFonts({
    'SFProText-Bold': require('../assets/fonts/SFProText-Bold.otf'),
    'SFProText-Semibold': require('../assets/fonts/SFProText-Semibold.otf'),
    'SFProText-Medium': require('../assets/fonts/SFProText-Medium.otf'),
    'SFProText-Regular': require('../assets/fonts/SFProText-Regular.otf'),
  });

  useEffect(() => {
    if (loaded || error) {
      console.log('Font loaded');
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  
  return (
    // <Redirect href="/authen/onboarding" /> 
    // <ProfilePage />
    // <ProfileDetail />
    // <ProfileEdit />
    <ChangePassword />
  )
}
