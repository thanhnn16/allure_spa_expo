import React, { useState } from 'react';
import { View } from 'react-native-ui-lib';
import { TextInput } from '@/components/inputs/TextInput';
import i18n from '@/languages/i18n';
import AppButton from '@/components/buttons/AppButton';

interface LoginZaloFormProps {
  sendOtpPress: () => void;
  onBackPress: () => void;
}

const LoginZaloForm: React.FC<LoginZaloFormProps> = ({ sendOtpPress, onBackPress }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    setLoading(true);
    // Simulate OTP sending process
    setTimeout(() => {
      setLoading(false);
      sendOtpPress(); // Call the sendOtpPress function to change the form
    }, 1000);
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
