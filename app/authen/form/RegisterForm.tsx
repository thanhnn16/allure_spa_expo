import React, { useState } from 'react';
import { View, Text, Colors } from 'react-native-ui-lib';
import { TextInput } from '@/components/inputs/TextInput';
import i18n from '@/languages/i18n';
import AppButton from '@/components/buttons/AppButton';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/redux/ReduxStore';
import { registerThunk } from '@/redux/users/RegisterThunk';
import { unwrapResult } from '@reduxjs/toolkit';
import { Alert, ActivityIndicator } from 'react-native';

interface RegisterFormProps {
  onBackPress: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onBackPress }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [fullNameError, setFullNameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const validatePhoneNumber = (phone: string) => {
    if (!phone) {
      setPhoneError(i18n.t('auth.register.empty_phone_number'));
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setPhoneError(i18n.t('auth.register.invalid_phone_number'));
      return false;
    }
    setPhoneError('');
    return true;
  };

  const validateFullName = (name: string) => {
    if (!name) {
      setFullNameError(i18n.t('auth.register.empty_full_name'));
      return false;
    }
    const nameRegex = /^[^\d]+$/;
    if (!nameRegex.test(name)) {
      setFullNameError(i18n.t('auth.register.invalid_full_name'));
      return false;
    }
    setFullNameError('');
    return true;
  };

  const validatePassword = (pass: string) => {
    if (!pass) {
      setPasswordError(i18n.t('auth.register.empty_password'));
      return false;
    }
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/g;
    if (specialCharRegex.test(pass)) {
      setPasswordError(i18n.t('auth.register.invalid_password_special_char'));
      return false;
    }
    if (pass.length < 8) {
      setPasswordError(i18n.t('auth.register.invalid_password_length'));
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = (pass: string, confirmPass: string) => {
    if (pass !== confirmPass) {
      setConfirmPasswordError(i18n.t('auth.register.password_mismatch'));
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleRegister = async () => {
    const isPhoneValid = validatePhoneNumber(phoneNumber);
    const isFullNameValid = validateFullName(fullName);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

    if (!isPhoneValid || !isFullNameValid || !isPasswordValid || !isConfirmPasswordValid) {
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
    } catch (error: any) {
      Alert.alert(i18n.t('auth.register.error'), error.message || i18n.t('auth.register.unknown_error'));
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
        title={i18n.t('auth.register.fullname')}
        placeholder={i18n.t('auth.register.fullname')}
        value={fullName}
        onChangeText={setFullName}
        onBlur={() => validateFullName(fullName)}
      />
      {fullNameError ? <Text style={{ color: 'red' }}>{fullNameError}</Text> : null}

      <TextInput
        title={i18n.t('auth.register.password')}
        placeholder={i18n.t('auth.register.password')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onBlur={() => validatePassword(password)}
      />
      {passwordError ? <Text style={{ color: 'red' }}>{passwordError}</Text> : null}

      <TextInput
        title={i18n.t('auth.register.confirm_password')}
        placeholder={i18n.t('auth.register.confirm_password')}
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        onBlur={() => validateConfirmPassword(password, confirmPassword)}
      />
      {confirmPasswordError ? <Text style={{ color: 'red' }}>{confirmPasswordError}</Text> : null}

      <View marginT-20 marginB-20>
        <AppButton
          type="primary"
          onPress={handleRegister}
          disabled={loading}
          buttonStyle={{ backgroundColor: loading ? Colors.grey60 : Colors.primary }}
          titleStyle={{ color: Colors.background }}
        >
          {loading ? <ActivityIndicator size="small" color={Colors.primary} /> : <Text style={{ color: '#FFFFFF', fontSize: 20, fontFamily: 'OpenSans-Regular', fontWeight: 'bold' }}>
            {i18n.t('auth.register.title')}
          </Text>}
        </AppButton>
        <AppButton title={i18n.t('back')} type="outline" marginT-12 onPress={onBackPress} />
      </View>
    </>
  );
};

export default RegisterForm;
