import React, { useState } from 'react';
import { View, TextInput, Text, ActivityIndicator } from 'react-native';
import { useDispatch } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { router } from 'expo-router';
import AppDialog from '../dialog/AppDialog';

import Colors from '../../constants/Colors';
import i18n from '@/languages/i18n';
import AppButton from '../buttons/AppButton';
import {loginThunk} from "@/redux";

interface LoginFormProps {
  onBackPress: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onBackPress }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogType, setDialogType] = useState<'success' | 'error' | 'info' | 'warning'>('info');
  const [dialogTitle, setDialogTitle] = useState('');
  const [dialogDescription, setDialogDescription] = useState('');
  const dispatch = useDispatch();

  const showDialog = (type: 'success' | 'error' | 'info' | 'warning', title: string, description: string) => {
    setDialogType(type);
    setDialogTitle(title);
    setDialogDescription(description);
    setDialogVisible(true);
  };

  const validatePhoneNumber = (phone: string) => {
    if (!phone) {
      setPhoneError(i18n.t('auth.login.empty_phone_number'));
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError(i18n.t('auth.login.invalid_phone_number'));
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validatePassword = (pass: string) => {
    if (!pass) {
      setPasswordError(i18n.t('auth.login.empty_password'));
      return false;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
    if (specialCharRegex.test(pass)) {
      setPasswordError(i18n.t('auth.login.invalid_password_special_char'));
      return false;
    }
    if (pass.length < 8) {
      setPasswordError(i18n.t('auth.login.invalid_password_length'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleLogin = async () => {
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    const isPasswordValid = validatePassword(password);

    if (!isPhoneValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const resultAction = await dispatch(loginThunk({ phoneNumber, password }));
      const result = unwrapResult(resultAction);

      if (result && result.success) {
        showDialog('success', i18n.t('auth.login.success'), result.message);
        router.replace('/(tabs)/home');
      } else {
        showDialog('error', i18n.t('auth.login.error'), result?.message ?? i18n.t('auth.login.unknown_error'));
      }
    } catch (error: any) {
      if (error.response && error.response.status === 503) {
        showDialog('error', i18n.t('auth.login.server_error'), i18n.t('auth.login.server_error'));
      } else if (error.status === 500) {
        showDialog('error', i18n.t('auth.login.error'), i18n.t('auth.login.invalid_credentials'));
      } else {
        showDialog('error', i18n.t('auth.login.error'), error.message || i18n.t('auth.login.unknown_error'));
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
            onBlur={() => validatePhoneNumber(phoneNumber)}
        />
        {phoneError ? <Text style={{ color: 'red' }}>{phoneError}</Text> : null}

        <TextInput
            title={i18n.t('auth.login.password')}
            placeholder={i18n.t('auth.login.password')}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            onBlur={() => validatePassword(password)}
        />
        {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}

        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>{i18n.t('auth.login.forgot_password')}</Text>
        </View>

        <View marginT-20 marginB-20>
          <AppButton
              type="primary"
              onPress={handleLogin}
              disabled={loading}
              buttonStyle={{ backgroundColor: loading ? Colors.grey60 : Colors.primary }}
              titleStyle={{ color: Colors.background }}
          >
            {loading ? <ActivityIndicator size="small" color={Colors.primary} /> : <Text style={{ color: '#FFFFFF', fontSize: 20, fontFamily: 'OpenSans-Regular', fontWeight: 'bold' }}>
              {i18n.t('auth.login.title')}
            </Text>}
          </AppButton>
          <AppButton title={i18n.t('back')} type="outline" marginT-12 onPress={onBackPress} />
        </View>

        <AppDialog
            visible={dialogVisible}
            severity={dialogType}
            title={dialogTitle}
            description={dialogDescription}
            closeButton={true}
            onClose={() => setDialogVisible(false)}
        />
      </>
  );
};

export default LoginForm;
