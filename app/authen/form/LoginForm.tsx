import React from 'react';
import { View, Alert, Text } from 'react-native';
import { TextInput } from '@/components/inputs/TextInput';
import AppButton from '@/components/buttons/AppButton';
import i18n from '@/languages/i18n';
// import { loginUser } from '@/app/authen/api/apiService';
import { Colors, TouchableOpacity } from 'react-native-ui-lib';

interface LoginFormProps {

  phoneNumber: string;

  password: string;

  setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;

  setPassword: React.Dispatch<React.SetStateAction<string>>;

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
    const result = await loginUser(phoneNumber, password);

    if (result) {
      if (result.success) {
        Alert.alert('Success', result.message);
        // Handle successful login (e.g., navigate to the home screen)
      } else {
        Alert.alert('Error', result.message);
      }
    } else {
      Alert.alert('Error', 'An unexpected error occurred.');
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
      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: '90%', marginBottom: 20 }}>

        <TouchableOpacity onPress={onZaloPress}>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>
            {i18n.t('auth.login.zalo')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ marginBottom: 20 }}>
        <AppButton title={i18n.t('auth.login.title')} type="primary" onPress={onLoginPress} />
        <AppButton title={i18n.t('back')} type="outline" onPress={onBackPress} marginT-12 />
      </View>
    </>
  );
};

export default LoginForm;

