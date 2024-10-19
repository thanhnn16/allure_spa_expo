import React, { useState } from 'react';
import { View } from 'react-native-ui-lib';
import { TextInput } from '@/components/inputs/TextInput';
import i18n from '@/languages/i18n';
import AppButton from '@/components/buttons/AppButton';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/ReduxStore';
import { loginThunk } from '@/redux/users/LoginThunk';
import { unwrapResult } from '@reduxjs/toolkit';
import { Link } from 'expo-router';
import { Alert } from 'react-native';

interface LoginFormProps {
  onBackPress: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onBackPress }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogin = async () => {
    setLoading(true);

    try {
      const resultAction = await dispatch(loginThunk({ phoneNumber, password }));
      const result = unwrapResult(resultAction);

      if (result && result.success) {
        Alert.alert(i18n.t('auth.login.success'), result.message);
        // Navigate to Home screen using Link
        <Link href="/(tabs)/home" asChild>
          <AppButton title={i18n.t('auth.login.title')} type="primary" />
        </Link>
      } else {
        Alert.alert(i18n.t('auth.login.error'), result?.message ?? i18n.t('auth.login.unknown_error'));
      }
    } catch (error: any) {
      if (error.status === 500) {
        Alert.alert(i18n.t('auth.login.error'), i18n.t('auth.login.invalid_credentials'));
      } else {
        Alert.alert(i18n.t('auth.login.error'), error.message || i18n.t('auth.login.unknown_error'));
      }
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
        title={i18n.t('auth.login.password')}
        placeholder={i18n.t('auth.login.password')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View marginT-20>
        <AppButton
          type="primary"
          title={i18n.t('auth.login.title')}
          onPress={handleLogin}
          loading={loading}
        />
      </View>
      <AppButton title={i18n.t('back')} type="outline" marginT-12 onPress={onBackPress} />
    </>
  );
};

export default LoginForm;