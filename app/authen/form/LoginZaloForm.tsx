import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native-ui-lib';
import { TextInput } from '@/components/inputs/TextInput';
import AppButton from '@/components/buttons/AppButton';
import i18n from '@/languages/i18n';

interface LoginZaloFormProps {
  phoneNumber: string;
  fullName: string;
  setPhoneNumber: (text: string) => void;
  setPassword: (text: string) => void;
  onZaloPress: () => void;
  onLoginPress: () => void;
  onBackPress: () => void;
}

const LoginZaloForm: React.FC<LoginZaloFormProps> = ({
  phoneNumber,
  fullName,
  setPhoneNumber,
  setPassword,
  onZaloPress,
  onLoginPress,
  onBackPress,
}) => {
  return (
    <>
      <TextInput
        title={i18n.t('auth.login.username')}
        placeholder={i18n.t('auth.login.username')}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
      />
      <TextInput
        title={i18n.t('auth.register.fullname')}
        placeholder={i18n.t('auth.register.fullname')}
        secureTextEntry
        value={fullName}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          width: '90%',
        }}
      >
      </View>
      <View style={{ marginBottom: 20 }}>
        <AppButton title={i18n.t('auth.login.title')} type="primary" onPress={onLoginPress} />
        <AppButton title={i18n.t('back')} type="outline" onPress={onBackPress} marginT-12 />
      </View>
    </>
  );
};

export default LoginZaloForm;
