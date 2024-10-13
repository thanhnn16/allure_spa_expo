import React, { useState } from 'react';
import { Alert, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { View, Image, Text, Colors } from 'react-native-ui-lib';
import { TextInput } from '@/components/inputs/TextInput';
import AppButton from '@/components/buttons/AppButton';
import Brand from '@/assets/images/common/logo-brand.svg';
import colors from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import { useRouter } from 'expo-router';
import i18n from '@/languages/i18n';

const Register: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const router = useRouter();

  const sendOTP = async () => {
    try {
      if (!phoneNumber) {
        Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
        return;
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMessage = (error as Error).message || 'Có lỗi xảy ra khi gửi OTP';
      Alert.alert('Lỗi', errorMessage);
    }
  };

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
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />
            <TextInput
              title="Họ và tên"
              placeholder="Nhập họ và tên"
              value={fullName}
              onChangeText={setFullName}
            />
            <View style={{ paddingHorizontal: Spacings.s6, marginBottom: 30 }}>
              <AppButton
                title="Gửi OTP"
                type="primary"
                onPress={sendOTP}
              />
              <AppButton
                title="Quay lại"
                type="outline"
                onPress={() => router.back()}
                marginT-12
              />
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

export default Register;
