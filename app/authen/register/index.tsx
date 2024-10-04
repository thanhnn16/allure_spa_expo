// src/screens/ConfirmPhoneNumber.tsx
import React, { useEffect, useState } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { ImageBackground, Linking } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { TextInput } from '@/components/inputs/TextInput';
import { Link } from 'expo-router';

import Brand from '@/assets/images/common/logo-brand.svg';
import colors from '@/constants/Colors';
import AppButton from '@/components/buttons/AppButton';

SplashScreen.preventAutoHideAsync();


const Register: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');

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
        <TextInput
          title="Số điện thoại"
          placeholder="Nhập số điện thoại"
          value={phoneNumber}
        />
        <TextInput
          title="Họ và tên"
          placeholder="Nhập họ và tên"
          onChangeText={setFullName}
          value={fullName}
        />
        <Link href="/authen/otp" asChild>
        <AppButton
          title="Gửi mã OTP"
          type='primary'
        />
        </Link>
        <Link href="/authen/" asChild>
          <AppButton  title="Quay lại" type='outline' />
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

export default Register;
