import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput } from '@/components/inputs/TextInput';
import i18n from '@/languages/i18n';
import { generateCodeChallenge, generateCodeVerifier, openZaloLogin } from '@/utils/services/zalo/zaloAuthService';
import AppButton from "@/components/buttons/AppButton";

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
  const [phoneError, setPhoneError] = useState('');
  const [fullNameError, setFullNameError] = useState('');

  const isValidFullName = (name: string) => {
    const regex = /^[^\d]+$/; // Allows any character except digits
    return regex.test(name);
  };

  const handleSendOtp = async () => {
    let valid = true;

    if (!isValidVietnamesePhoneNumber(phoneNumber)) {
      setPhoneError(i18n.t('auth.login.invalid_phone_number'));
      valid = false;
    } else {
      setPhoneError('');
    }

    if (!fullName) {
      setFullNameError(i18n.t('auth.login.enter_full_name'));
      valid = false;
    } else if (!isValidFullName(fullName)) {
      setFullNameError(i18n.t('auth.login.invalid_full_name'));
      valid = false;
    } else {
      setFullNameError('');
    }

    if (!valid || loading) return;

    setLoading(true);

    try {
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);

      openZaloLogin(codeChallenge, phoneNumber, fullName);
      sendOtpPress(); // Adjust to proceed to the next step after opening the login
    } catch (error) {
      console.error('Error sending OTP:', error);
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
            onBlur={() => {
              if (!isValidVietnamesePhoneNumber(phoneNumber)) {
                setPhoneError(i18n.t('auth.login.invalid_phone_number'));
              } else {
                setPhoneError('');
              }
            }}
        />
        {phoneError ? <Text style={{ color: 'red' }}>{phoneError}</Text> : null}

        <TextInput
            title={i18n.t('auth.register.fullname')}
            placeholder={i18n.t('auth.register.fullname')}
            value={fullName}
            onChangeText={setFullName}
            onBlur={() => {
              if (!isValidFullName(fullName)) {
                setFullNameError(i18n.t('auth.login.invalid_full_name'));
              } else {
                setFullNameError('');
              }
            }}
        />
        {fullNameError ? <Text style={{ color: 'red' }}>{fullNameError}</Text> : null}

        <View marginT-10 marginB-20>
          <AppButton
                type="primary"
                title={i18n.t('sendOTP')}
                onPress={handleSendOtp}
                loading={loading}
          />
          <AppButton title={i18n.t('back')} type="outline" marginT-12 onPress={onBackPress} />
        </View>
      </View>
  );
};

export default LoginZaloForm;
