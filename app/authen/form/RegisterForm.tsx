import React, { useState } from 'react';
import { View } from 'react-native-ui-lib';
import { TextInput } from '@/components/inputs/TextInput';
import i18n from '@/languages/i18n';
import AppButton from '@/components/buttons/AppButton';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/ReduxStore';
import { registerThunk } from '@/redux/users/RegisterThunk';
import { unwrapResult } from '@reduxjs/toolkit';
import { Alert } from 'react-native';

interface RegisterFormProps {
  phoneNumber: string;
  fullName: string;
  password: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
  setFullName: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onBackPress: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  phoneNumber,
  fullName,
  password,
  setPhoneNumber,
  setFullName,
  setPassword,
  onBackPress,
}) => {
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert(i18n.t('auth.register.password_mismatch'), i18n.t('auth.register.check_password'));
      return;
    }

    setLoading(true);

    try {
      const resultAction = await dispatch(registerThunk({ fullName, phoneNumber, password, confirmPassword }));
      const result = unwrapResult(resultAction);

      if (result && result.success) {
        Alert.alert(i18n.t('auth.register.success'), result.message);
        onBackPress();
      } else {
        Alert.alert(i18n.t('auth.register.error'), result?.message ?? i18n.t('auth.register.unknown_error'));
      }
    } catch (error) {
Alert.alert(i18n.t('auth.register.error'), i18n.t('auth.register.unknown_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
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

      <TextInput
        title={i18n.t('auth.register.password')}
        placeholder={i18n.t('auth.register.password')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        title={i18n.t('auth.register.confirm_password')}
        placeholder={i18n.t('auth.register.confirm_password')}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <View marginT-20>
        <AppButton
          type="primary"
          title={i18n.t('auth.register.title')}
          onPress={handleRegister}
          loading={loading}
        />
        <AppButton title={i18n.t('back')} type="outline" onPress={onBackPress} marginT-12 />
      </View>
    </>
  );
};

export default RegisterForm;
