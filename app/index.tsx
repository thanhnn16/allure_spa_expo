import { Redirect } from 'expo-router';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';

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
<<<<<<< HEAD
    <Redirect href="/authen/onboarding" /> 
=======
    <Redirect href="/authen/" /> 
>>>>>>> ae0c62715e4775858d76fa8a1afc1084b027577c
  )
}

