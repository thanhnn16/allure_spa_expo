import React, { useEffect } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { ImageBackground } from 'react-native';
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
    <ImageBackground
      source={require('@/assets/images/authen/img_bg_authen.png')}
      style={{ flex: 1 }}
    >
      <View center>
        <Image
          width={250}
          height={85}
          source={Brand}
        />
        <Text h2 style={{ textAlign: 'center', color: colors.primary, fontFamily: 'AlexBrush-Regular', fontSize: 32, paddingEnd: 50 }}>
          Nghệ thuật chăm da
        </Text>
        <Text h2 style={{ textAlign: 'center', color: colors.primary, fontFamily: 'AlexBrush-Regular', fontSize: 32, paddingStart: 50 }}>
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
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: 345, marginTop: Spacings.s9, marginBottom: Spacings.s3 }}>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>Quên mật khẩu?</Text>
        </View>
        <Link href="/(tabs)/home" asChild>
          <AppButton type="primary" title={i18n.t('auth.login.title')} />
        </Link>

        <Link href="/authen/" asChild>
          <AppButton type="secondary" title={i18n.t('auth.login.title')} />
        </Link>
        <Text center marginT-20 marginB-100 style={{ paddingHorizontal: Spacings.s6 }}>
          Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
          <Text style={{ fontWeight: 'bold' }}>Điều khoản sử dụng</Text> và{' '}
          <Text style={{ fontWeight: 'bold' }}>Chính sách bảo mật</Text> của chúng tôi
        </Text>
      </View>
    </ImageBackground>
  );
};

export default Login;
