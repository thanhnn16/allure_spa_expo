import React, { useEffect } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { ImageBackground, TouchableOpacity, StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Link, router } from 'expo-router';
import AppButton from '@/components/buttons/AppButton';
import SendButton from '../../../components/buttons/PrimaryButton';
import BackButton from '../../../components/buttons/SecondaryButton';
import { I18n } from 'i18n-js';
import i18n from '@/assets/languages/i18n';


import logoName from '../../../assets/images/authen/logoName.svg';
import colors from '@/rn/colors';
import { getBackgroundColor } from 'react-native-ui-lib/src/helpers/AvatarHelper';


SplashScreen.preventAutoHideAsync();

const commonButtonStyle = {
};


const Onboarding: React.FC = () => {
  const [fontsLoaded] = useFonts({
    'AlexBrush-Regular': require('../../../assets/fonts/AlexBrush-Regular.ttf'),
    'OpenSans-Regular': require('../../../assets/fonts/OpenSans-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ImageBackground
      source={require('@/assets/images/authen/img_bg_authen.png')}
      style={{ flex: 1 }}
    >
      <View center>
        <Image
          width={250}
          height={85}
          source={logoName}
        />
        <Text
          marginR-85
          style={{ fontFamily: 'AlexBrush-Regular', color: Colors.primary, textAlign: 'center', fontSize: 32 }}
        >
          Nghệ thuật chăm da
        </Text>
        <Text
          marginL-65
          style={{ fontFamily: 'AlexBrush-Regular', color: Colors.primary, textAlign: 'center', fontSize: 32 }}
        >
          Từ nghệ nhân Nhật Bản
        </Text>
      </View>
      <View
        style={{
          backgroundColor: colors.white,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingBottom: 20,
          paddingTop: 40,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          alignItems: 'center',
        }}
      >
        <SendButton title='Đăng ký' />

        <Link push href="/authen/login" asChild>
          <SendButton title={i18n.t('auth.login.title')} />
        </Link>


        <Link push href="/authen/confirmPhoneNumber" asChild>
          <AppButton
            titleStyle={{ color: Colors.primary, fontFamily: 'OpenSans-Regular', fontSize: 20 }}
            title="Đăng nhập bằng Zalo"
          />
        </Link>

        <AppButton
          titleStyle={{ color: Colors.primary, fontFamily: 'OpenSans-Regular', fontSize: 20 }}
          title="Languages"
        />

        <TouchableOpacity style={styles.button}>
          <Text style={styles.title}>Khám phá sau</Text>
        </TouchableOpacity>

        <Text center color-black marginT-20 marginB-100 style={{ paddingHorizontal: 20 }}>
          Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
          <Text color-black style={{ fontWeight: 'bold' }}>Điều khoản sử dụng</Text> và{' '}
          <Text color-black style={{ fontWeight: 'bold' }}>Chính sách bảo mật</Text> của chúng tôi
        </Text>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.white,
    borderRadius: 8,
    height: 28,
    marginVertical: 6,
    marginHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: Colors.black,
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    textDecorationLine: 'underline',
    paddingTop: Spacings.s2,
  },
});

export default Onboarding;