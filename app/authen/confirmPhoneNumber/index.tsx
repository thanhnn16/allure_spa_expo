// src/screens/ConfirmPhoneNumber.tsx
import React, { useEffect, useState } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { Alert } from 'react-native';
import { ImageBackground, Linking } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationProp } from '@react-navigation/native';
import AppButton from '@/components/buttons/AppButton';
import { AppTextInput } from '@/components/AppTextInput';
import SendButton from '../../../components/buttons/PrimaryButton';
import BackButton from '../../../components/buttons/SecondaryButton';
import { Link } from 'expo-router';

import logoName from '../../../assets/images/authen/logoName.svg';
import {
  generateCodeVerifier,
  generateCodeChallenge,
  openZaloLogin,
  getAccessToken
} from '../zalo/zaloAuthService';
import { sendOtpRequest } from '../zalo/otpService';
import colors from '@/rn/colors';

SplashScreen.preventAutoHideAsync();

interface ConfirmPhoneNumberProps {
  navigation: NavigationProp<any>;
}

const commonInputStyle = {
  width: 345,
  height: 45,
};

const ConfirmPhoneNumber: React.FC<ConfirmPhoneNumberProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'AlexBrush-Regular': require('@/assets/fonts/AlexBrush-Regular.ttf'),
    'OpenSans-Regular': require('@/assets/fonts/OpenSans-Regular.ttf'),
  });

  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [codeVerifier, setCodeVerifier] = useState('');
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    const handleDeepLink = async (event: { url: string }) => {
      const url = event.url;
      const parsedUrl = new URL(url);
      const queryParams = Object.fromEntries(parsedUrl.searchParams.entries());

      const oauthCode = queryParams.code;
      if (oauthCode) {
        console.log('OauthCode:', oauthCode);
        if (!codeVerifier) {
          Alert.alert('Lỗi', 'Không tìm thấy Code Verifier!');
          return;
        }
        const tokenResponse = await getAccessToken(oauthCode, codeVerifier);
        if (tokenResponse) {
          const { access_token, refresh_token, expires_in } = tokenResponse;
          setAccessToken(access_token);

          // Gửi OTP qua số điện thoại
          const otpResponse = await sendOtpRequest(phoneNumber, access_token);
          if (otpResponse && otpResponse.success) {
            Alert.alert('Thông báo', 'Gửi mã OTP thành công!', [{ text: 'OK' }]);
            navigation.navigate('OtpScreen', { phoneNumber, fullName });
          } else {
            Alert.alert('Lỗi', 'Gửi mã OTP không thành công, vui lòng thử lại!');
          }
        } else {
          Alert.alert('Lỗi', 'Lấy AccessToken không thành công!');
        }
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Kiểm tra nếu app được mở với một URL ban đầu
    (async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink({ url: initialUrl });
      }
    })();

    return () => {
      subscription.remove();
    };
  }, [codeVerifier, phoneNumber, navigation]);

  const handleSendOtp = () => {
    if (!phoneNumber) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại!');
      return;
    }
    if (!fullName) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên!');
      return;
    }

    const newCodeVerifier = generateCodeVerifier();
    const newCodeChallenge = generateCodeChallenge(newCodeVerifier);
    setCodeVerifier(newCodeVerifier);

    // Mở Zalo login
    openZaloLogin(newCodeChallenge);
  };

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
        }}>
        <AppTextInput
          title="Số điện thoại"
          placeholder="Nhập số điện thoại"
          containerStyle={{ ...commonInputStyle, marginBottom: 12, marginTop: 42 }}
          titleStyle={{
            fontSize: 16,
            fontFamily: 'OpenSans-Regular',
            color: Colors.primary,
          }}
          textInputStyle={{ height: 30, color: Colors.black }}
          onChangeText={setPhoneNumber}
          value={phoneNumber}
        />
        <AppTextInput
          title="Họ và tên"
          placeholder="Nhập họ và tên"
          containerStyle={{ ...commonInputStyle, marginBottom: 52, marginTop: 32 }}
          titleStyle={{
            fontSize: 16,
            fontFamily: 'OpenSans-Regular',
            color: Colors.primary,
          }}
          textInputStyle={{ height: 30, color: Colors.black }}
          onChangeText={setFullName}
          value={fullName}
        />
        <Link href="/(authen)/otp" asChild>
        <SendButton
          title="Gửi mã OTP"
          onPress={handleSendOtp}
        />
        </Link>
        <Link href="/(authen)/onboarding" asChild>
          <BackButton title="Quay lại" />
        </Link>
        <Text
          center
          color={Colors.black}
          marginT-20
          marginB-100
          style={{ paddingHorizontal: Spacings.s6 }}
        >
          Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
          <Text color={Colors.black} style={{ fontWeight: 'bold' }}>
            Điều khoản sử dụng
          </Text>{' '}
          và{' '}
          <Text color={Colors.black} style={{ fontWeight: 'bold' }}>
            Chính sách bảo mật
          </Text>{' '}
          của chúng tôi
        </Text>
      </View>
    </ImageBackground>
  );
};

export default ConfirmPhoneNumber;
