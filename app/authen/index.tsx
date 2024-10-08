import React, { useState } from 'react';
import { View, Image, Text, Colors, Button, TouchableOpacity } from 'react-native-ui-lib';
import { Link } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AppButton from '@/components/buttons/AppButton';
import i18n from '@/languages/i18n';
import Brand from '@/assets/images/common/logo-brand.svg';

SplashScreen.preventAutoHideAsync();

const Onboarding: React.FC = ( ) => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);

  const changeLanguage = (language: string) => {
    i18n.locale = language;
    setCurrentLanguage(language);
  };

  return (
    <View flex>
      <Image
        source={require('@/assets/images/authen/img_bg_authen.png')}
        style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.5 }}
      />
      <View paddingT-40 centerH marginB-16>
        <Image
          source={Brand}
          width={250}
          height={85}
        />
        <Text
          text50BO
          center
          marginR-85
          style={{ fontFamily: 'AlexBrush-Regular', color: Colors.primary }}
        >
          {i18n.t('auth.art.title')}
        </Text>
        <Text
          text50BO
          center
          marginL-65
          marginB-150
          style={{ fontFamily: 'AlexBrush-Regular', color: Colors.primary }}
        >
          {i18n.t('auth.art.subtitle')}
        </Text>
      </View>
      <View
        bg-white
        paddingH-24
        paddingT-32
        flex
        style={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
        }}
      >
        <Link push href="/authen/register" asChild>
          {/* TODO: chỗ này dùng firebase để lấy otp đăng ký */}
          <AppButton title={i18n.t('auth.register.title')} type='primary' />
        </Link>

        <Link push href="/authen/login" asChild>
          <AppButton title={i18n.t('auth.login.title')} type='primary' />
        </Link>

        {/* TODO: chỗ này nếu đăng nhập bằng zalo gọi deeplink tới zalo yêu cầu đăng nhập luôn */}
        <Link push href="/authen/register" asChild>
          <AppButton title={i18n.t('auth.login.zalo')} type='secondary' />
        </Link>

        <AppButton
          title={i18n.t('change_language')}
          type='secondary'
          onPress={() => {
            const nextLanguage = currentLanguage === 'en' ? 'ja' : currentLanguage === 'ja' ? 'vi' : 'en';
            changeLanguage(nextLanguage);
          }}
        />

        <Link href="/(tabs)/home" asChild>
          <AppButton title={i18n.t('auth.login.skip')} type='text' />
        </Link>

        <Text center text80 marginT-20>
          {i18n.t('auth.login.by_continue')}
          <Text text80H>{i18n.t('auth.login.terms')} </Text>
          {''}{i18n.t('auth.login.and')} {''}
          <Text text80H>{i18n.t('auth.login.privacy')}</Text>
          {i18n.t('auth.login.of_us')}
        </Text>
      </View>
    </View>
  );
};

export default Onboarding;