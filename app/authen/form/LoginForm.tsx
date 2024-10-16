import React from 'react';
import { View, TouchableOpacity, Text, Colors, Spacings } from 'react-native-ui-lib';
import { TextInput } from '@/components/inputs/TextInput';
import AppButton from '@/components/buttons/AppButton';
import i18n from '@/languages/i18n';
import axios from 'axios';
import { Alert } from 'react-native';

interface LoginFormProps {
  phoneNumber: string;
  password: string;
  setPhoneNumber: (text: string) => void;
  setPassword: (text: string) => void;
  onZaloPress: () => void;
  onLoginPress: () => Promise<void>;
  onBackPress: () => void;

}

const LoginForm: React.FC<LoginFormProps> = ({
  phoneNumber,
  password,
  setPhoneNumber,
  setPassword,
  onZaloPress,
  onBackPress,
}) => {

  const onLoginPress = async () => {
    try {
      const response = await axios.post('/api/auth/login', {
        phone_number: phoneNumber,
        password: password,
      });

      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        // Handle successful login (e.g., navigate to the home screen)
      }
    } catch (error) {
      const err = error as any;
      if (err.response) {
        Alert.alert('Error', err.response.data.message || 'Login failed');
      } else {
        Alert.alert('Error', 'Network error, please try again');
      }
    }
  };

  return (
    <>
      <TextInput
        title={i18n.t('auth.login.username')}
        placeholder={i18n.t('auth.login.username')}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        title={i18n.t('auth.login.password')}
        placeholder={i18n.t('auth.login.password')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          width: '90%',
          marginBottom: Spacings.s3,
        }}
      >
        <Text style={{ color: Colors.primary, fontSize: 16 }}>
          {i18n.t('auth.login.zalo')}
        </Text>
      </View>
      <View style={{ marginBottom: 20 }}>
        <AppButton title={i18n.t('auth.login.title')} type="primary" onPress={onLoginPress} />
        <AppButton title={i18n.t('back')} type="outline" onPress={onBackPress} marginT-12 />
      </View>
    </>
  );
};

export default LoginForm;
