import { Redirect } from 'expo-router';
import { Link } from 'expo-router';
import { View } from 'react-native-ui-lib';
import ChangeLanguageExample from './example-changeLanguage/change_language_example';

export default function Index() {
  const [loaded, error] = useFonts({
    'SFProText-Bold': require('@/assets/fonts/SFProText-Bold.otf'),
    'SFProText-Semibold': require('@/assets/fonts/SFProText-Semibold.otf'),
    'SFProText-Medium': require('@/assets/fonts/SFProText-Medium.otf'),
    'SFProText-Regular': require('@/assets/fonts/SFProText-Regular.otf'),
    'AlexBrush-Regular': require('@/assets/fonts/AlexBrush-Regular.ttf'),
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
    <Redirect href="/authen/onboarding" /> 
  )
}

