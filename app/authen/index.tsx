import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  Colors,
  Spacings,
  // Keyboard,
} from 'react-native-ui-lib';
import { TouchableWithoutFeedback } from 'react-native';
import { Dimensions, Platform, KeyboardAvoidingView, Keyboard } from 'react-native';
import AppButton from '@/components/buttons/AppButton';
import i18n from '@/languages/i18n';
import Brand from '@/assets/images/common/logo-brand.svg';
import { TextInput } from '@/components/inputs/TextInput';
import { Link } from 'expo-router/build/link/Link';


const { width, height } = Dimensions.get('window'); // Get screen width and height dynamically

const Onboarding: React.FC = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);
  const [viewState, setViewState] = useState('default');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');

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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View flex>
          <Image
            source={require('@/assets/images/authen/img_bg_authen.png')}
            style={{
              position: 'absolute',
              width: '100%', // Full screen width
              height: '100%', // Full screen height
              opacity: 0.5,
            }}
          />
          <View paddingT-40 centerH marginB-16>
            <Image
              source={Brand}
              style={{ width: width * 0.6, height: height * 0.1 }}
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
              style={{ fontFamily: 'AlexBrush-Regular', color: Colors.primary }}
            >
              {i18n.t('auth.art.subtitle')}
            </Text>
          </View>

          <View
            bg-white
            width="100%"
            paddingH-24
            paddingT-32
            paddingB-64
            absB
            style={{
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          >
            {viewState === 'default' ? (
              <View>
                <AppButton
                  title={i18n.t('auth.register.title')}
                  type="primary"
                  onPress={() => handleButtonClick('register')}
                />
                <AppButton
                  title={i18n.t('auth.login.title')}
                  type="primary"
                  onPress={() => handleButtonClick('login')}
                />
                <AppButton
                  title={i18n.t('auth.login.zalo')}
                  type="secondary"
                  onPress={() => handleButtonClick('changed')}
                />
                <AppButton
                  title={i18n.t('change_language')}
                  type="secondary"
                  onPress={() => {
                    const nextLanguage =
                      currentLanguage === 'en'
                        ? 'ja'
                        : currentLanguage === 'ja'
                        ? 'vi'
                        : 'en';
                    changeLanguage(nextLanguage);
                  }}
                />
                <Link href="/(tabs)/home" asChild>
                  <AppButton title={i18n.t('auth.login.skip')} type="text" />
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
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-end',
                    width: '90%',
                    marginBottom: Spacings.s3,
                  }}
                >
                  <Text style={{ color: Colors.primary, fontSize: 16 }}>
                    {i18n.t('auth.login.zalo')}
                  </Text>
                </View>
                <View style={{ marginBottom: 20 }}>
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
                  title={i18n.t('auth.register.fullname')}
                  placeholder={i18n.t('auth.register.fullname')}
                  value={fullName}
                  onChangeText={setFullName}
                />
                <View style={{ marginBottom: 20 }}>
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

            <Text center text80>
              {i18n.t('auth.login.by_continue')}
              <Text text80H> {i18n.t('auth.login.terms')} </Text>
              {''}
              {i18n.t('auth.login.and')}
              {''}
              <Text text80H>{i18n.t('auth.login.privacy')}</Text>
              {''} {i18n.t('auth.login.of_us')}
            </Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Onboarding;
