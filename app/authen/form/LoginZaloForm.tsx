import React, { useState } from 'react';
import { TextInput } from '@/components/inputs/TextInput';
import i18n from '@/languages/i18n';
import AppButton from '@/components/buttons/AppButton';
import { generateCodeChallenge, generateCodeVerifier, openZaloLogin } from '@/utils/services/zalo/zaloAuthService';
import { router } from 'expo-router';
import { Text, View } from 'react-native-ui-lib';
const isValidVietnamesePhoneNumber = (phoneNumber: string) => {
  const regex = /^(?:\+84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return regex.test(phoneNumber);
};

const LoginZaloForm: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [fullNameError, setFullNameError] = useState('');

  const isValidFullName = (name: string) => {
    const regex = /^[^\d]+$/; // Allows any character except digits
    return regex.test(name);
  };

  const handleSendOtp = async () => {
    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);
      openZaloLogin(codeChallenge);
    } catch (error) {
      console.error('Error sending OTP:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View>
      <Text text70H>{i18n.t('auth.login_with_zalo')}</Text>
      <View marginT-10 marginB-20>
        <AppButton
          type="primary"
          title={i18n.t('sendOTP')}
          loading={loading}
          onPress={handleSendOtp}
        />
        <AppButton title={i18n.t('back')} type="outline" marginT-12 onPress={() => router.back()} />
      </View>
  );
};

export default LoginZaloForm;
