import React, { useState } from 'react';
import { View, Alert } from 'react-native';
import { TextInput } from '@/components/inputs/TextInput';
import i18n from '@/languages/i18n';
import AppButton from '@/components/buttons/AppButton';
import { generateCodeChallenge, generateCodeVerifier, openZaloLogin } from '@/utils/services/zalo/zaloAuthService';

interface LoginZaloFormProps {
  sendOtpPress: () => void;
  onBackPress: () => void;
}

const isValidVietnamesePhoneNumber = (phoneNumber: string) => {
  const regex = /^(?:\+84|0)(?:3[2-9]|5[6|8|9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/;
  return regex.test(phoneNumber);
};

const LoginZaloForm: React.FC<LoginZaloFormProps> = ({ sendOtpPress, onBackPress }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!isValidVietnamesePhoneNumber(phoneNumber)) {
      Alert.alert(i18n.t('auth.invalid_phone_number'));
      return;
    }

    if (!fullName) {
      Alert.alert(i18n.t('auth.enter_full_name'));
      return;
    }

    if (loading) return; // Prevent multiple submissions
    setLoading(true);

    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);
  
      openZaloLogin(codeChallenge, phoneNumber, fullName);
      sendOtpPress(); // Adjust to proceed to the next step after opening the login
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert(i18n.t('auth.otp_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <TextInput
        title={i18n.t('auth.register.phone_number')}
        placeholder={i18n.t('auth.register.phone_number')}
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
      <View marginT-10 marginB-20>
        <AppButton
          type="primary"
          title={i18n.t('sendOTP')}
          loading={loading}
          onPress={handleSendOtp}
        />
        <AppButton title={i18n.t('back')} type="outline" marginT-12 onPress={onBackPress} />
      </View>
    </View>
  );
};

export default LoginZaloForm;
