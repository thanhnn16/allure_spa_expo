import React, { useState } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { Link, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import AppButton from '@/components/buttons/AppButton';
import i18n from '@/languages/i18n';
import Brand from '@/assets/images/common/logo-brand.svg';
import { TextInput } from '@/components/inputs/TextInput';
import colors from 'react-native-ui-lib/src/style/colors';

SplashScreen.preventAutoHideAsync();

const Onboarding: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);
  const [viewState, setViewState] = useState('default');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const changeLanguage = (language: string) => {
    i18n.locale = language;
    setCurrentLanguage(language);
  };

  const handleButtonClick = (newState: string) => {
    setViewState(newState);
  };

  const sendOTP = () => {
    console.log('OTP sent to:', phoneNumber);
  };

  return (
    <View flex>
      <Image
        source={require('@/assets/images/authen/img_bg_authen.png')}
        style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.5 }}
      />
      <View paddingT-40 centerH marginB-16>
        <Image source={Brand} width={250} height={85} />
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
        {viewState === 'default' ? (
          <View>
            <AppButton
              title={i18n.t('auth.register.title')}
              type='primary'
              onPress={() => handleButtonClick('register')}
            />
            <AppButton
              title={i18n.t('auth.login.title')}
              type='primary'
              onPress={() => handleButtonClick('login')}
            />
            <AppButton
              title={i18n.t('auth.login.zalo')}
              type='secondary'
              onPress={() => handleButtonClick('changed')}
            />
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
          </View>
        ) : viewState === 'login' ? (
          <>
            <TextInput
              title={i18n.t('auth.login.username')}
              placeholder={i18n.t('auth.login.username')}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
            <TextInput
              title={i18n.t('auth.login.password')}
              placeholder={i18n.t('auth.login.password')}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: 345, marginBottom: Spacings.s3 }}>
              <Text style={{ color: Colors.primary, fontSize: 16 }}>{i18n.t('auth.login.zalo')}</Text>
            </View>
            <View style={{ paddingHorizontal: Spacings.s6, marginBottom: 30 }}>
              <Link href="/(tabs)/home" asChild>
                <AppButton type="primary" title={i18n.t('auth.login.title')} />
              </Link>
              <AppButton
                title={i18n.t('back')}
                type="outline"
                onPress={() => setViewState('default')}
                marginT-12
              />
            </View>
          </>
        ) : (
          <>
            <TextInput
              title={i18n.t('auth.login.username')}
              placeholder={i18n.t('auth.login.username')}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TextInput
              title={i18n.t('auth.register.username')}
              placeholder={i18n.t('auth.register.username')}
              value={fullName}
              onChangeText={setFullName}
            />
            <View style={{ paddingHorizontal: Spacings.s6, marginBottom: 30 }}>
              <AppButton title={i18n.t('sendOTP')} type="primary" onPress={sendOTP} />
              <AppButton
                title={i18n.t('back')}
                type="outline"
                onPress={() => setViewState('default')}
                marginT-12
              />
            </View>
          </>
        )}

        <Text center text80 marginT-20>
          {i18n.t('auth.login.by_continue')}
          <Text text80H> {i18n.t('auth.login.terms')} </Text>
          {''}{i18n.t('auth.login.and')} {''}
          <Text text80H>{i18n.t('auth.login.privacy')}</Text>
          {''} {i18n.t('auth.login.of_us')}
        </Text>
      </View>
    </View>
  );
};

export default Onboarding;
