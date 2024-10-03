import React, { useEffect } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationProp } from '@react-navigation/native';
import AppButton from '@/components/buttons/AppButton';
import { AppTextInput } from '@/components/AppTextInput';
import SendButton from '../../../components/buttons/PrimaryButton';
import BackButton from '../../../components/buttons/SecondaryButton';
import colors from '../../../rn/colors';
import spacings from '../../../rn/spacings';
import typography from '../../../rn/typography';
import { Link } from 'expo-router';

import logoName from '../../../assets/images/authen/logoName.svg';
import i18n from '@/assets/languages/i18n';


SplashScreen.preventAutoHideAsync();

interface LoginProps {
  navigation: NavigationProp<any>;
}

const commonInputStyle = {
  height: 45,
  borderRadius: 8,
  marginTop: Spacings.s3,
  marginVertical: 6,
  paddingHorizontal: 24,
};

const Login: React.FC<LoginProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'AlexBrush-Regular': require('@/assets/fonts/AlexBrush-Regular.ttf'),
    'OpenSans-Regular': require('@/assets/fonts/OpenSans-Regular.ttf'),
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
        <Text h2 style={{ textAlign: 'center', color: Colors.primary, fontFamily: 'AlexBrush-Regular', fontSize: 32, paddingEnd: 50 }}>
          Nghệ thuật chăm da
        </Text>
        <Text h2 style={{ textAlign: 'center', color: Colors.primary, fontFamily: 'AlexBrush-Regular', fontSize: 32, paddingStart: 50 }}>
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
        <AppTextInput
          title="Số điện thoại"
          placeholder="Nhập số điện thoại"
          containerStyle={{ ...commonInputStyle, marginBottom: 32, marginTop: 42 }}
          titleStyle={{
            fontSize: 16,
            fontFamily: 'OpenSans-Regular',
            color: Colors.primary,
          }}
          textInputStyle={{ height: 30, color: Colors.black }}
          keyboardType="numeric"
          maxLength={10}
        />

        <AppTextInput
          title="Mật khẩu"
          placeholder="Nhập mật khẩu"
          containerStyle={{ ...commonInputStyle, marginBottom: 22, marginTop: 22 }}
          titleStyle={{
            fontSize: 16,
            fontFamily: 'OpenSans-Regular',
            color: Colors.primary,
          }}
          textInputStyle={{ height: 30, color: Colors.black }}
          secureTextEntry
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: 345, marginTop: Spacings.s9, marginBottom: Spacings.s3 }}>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>Quên mật khẩu?</Text>
        </View>
        <Link href="/(tabs)/home" asChild>
          <SendButton title={i18n.t('auth.login.title')} />
        </Link>

        <Link href="/(authen)/onboarding" asChild>
          <BackButton />
        </Link>



        <Text center color={Colors.black} marginT-20 marginB-100 style={{ paddingHorizontal: Spacings.s6 }}>
          Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
          <Text color={Colors.black} style={{ fontWeight: 'bold' }}>Điều khoản sử dụng</Text> và{' '}
          <Text color={Colors.black} style={{ fontWeight: 'bold' }}>Chính sách bảo mật</Text> của chúng tôi
        </Text>
      </View>
    </ImageBackground>
  );
};

export default Login;
