import { Redirect } from 'expo-router';
import { useFonts } from 'expo-font';
import ProfilePage from './Profile';
import ProfileDetail from './Profile/profile_detail';
import ProfileEdit from './Profile/profile_edit';
import{ useEffect } from 'react';
import ChangePassword from './authen/changePassword';
// import { Login } from './authen/login';
import Voucher from './voucher';
import Rewward from './reward';
import AboutApp from './(tabs)/profile/aboutapp';



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

  // return <Redirect href="/authen" />
  return <AboutApp />;
}
