import React, { useEffect } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { Alert, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationProp } from '@react-navigation/native';
import { TextInput } from '@/components/inputs/TextInput';
import colors from '@/constants/Colors';
import { Link } from 'expo-router';

import Brand from '@/assets/images/common/logo-brand.svg';
import i18n from '@/languages/i18n';
import AppButton from '@/components/buttons/AppButton';



SplashScreen.preventAutoHideAsync();

interface LoginProps {
  navigation: NavigationProp<any>;
}

const Login: React.FC<LoginProps> = () => {

  

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={require('@/assets/images/authen/img_bg_authen.png')}
          style={{ flex: 1 }}
        >
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
            style={{
              backgroundColor: colors.white,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingTop: 40,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              paddingHorizontal: Spacings.s5,
            }}>
        <TextInput
          title="Số điện thoại"
          placeholder="Nhập số điện thoại"
          keyboardType="numeric"
          maxLength={10}
        />

        <TextInput
          title="Mật khẩu"
          placeholder="Nhập mật khẩu"
          secureTextEntry
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: 345, marginBottom: Spacings.s3 }}>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>Quên mật khẩu?</Text>
        </View>
        <View style={{ paddingHorizontal: Spacings.s6, marginBottom:30 }}>
        <Link href="/(tabs)/home" asChild>
          <AppButton type="primary"  title={i18n.t('auth.login.title')} />
        </Link>

        <Link href="/authen/" asChild>
          <AppButton type="secondary" title={i18n.t('auth.login.title')} />
        </Link>
        </View>
        <Text center text80 marginT-20 marginB-50>
              {i18n.t('auth.login.by_continue')}
              <Text text80H> {i18n.t('auth.login.terms')} </Text>
              {''}{i18n.t('auth.login.and')} {''}
              <Text text80H>{i18n.t('auth.login.privacy')}</Text>
              {''} {i18n.t('auth.login.of_us')}
            </Text>
      </View>
      </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

export default Login;
