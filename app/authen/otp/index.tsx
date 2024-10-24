import React, { useRef, useState, useEffect } from 'react';
import { Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground } from 'react-native';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { TextInput as RNTextInput } from 'react-native';
import AppButton, { AppButtonProps } from '@/components/buttons/AppButton';
import Brand from '@/assets/images/common/logo-brand.svg';
import colors from "@/constants/Colors";
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { forwardRef } from 'react-native-ui-lib';
import i18n from '@/languages/i18n';

const OTP: React.FC = () => {
  const inputRefs = useRef<(RNTextInput | null)[]>([]);
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [confirmation, setConfirmation] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getConfirmationResult = async () => {
      const storedConfirmationResult = await AsyncStorage.getItem('confirmationResult');
      if (storedConfirmationResult) {
        const confirmationResult = JSON.parse(storedConfirmationResult);
        setConfirmation(confirmationResult);
      } else {
        Alert.alert('Lỗi', 'Không tìm thấy kết quả xác nhận.');
      }
    };
    getConfirmationResult();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const otpArray = [...otp];
    otpArray[index] = value;
    setOtp(otpArray);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
      if (!otp.every((value) => value)) {
        Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ mã OTP');
        return;
      }
      else {
        const otpValue = otp.join('');
        router.push('/home');
      }
  
    };

  return (
    <View>
      <Text style={{ marginBottom: 50, fontSize: 20, fontWeight: 'bold', flexDirection: 'row', justifyContent: 'flex-end' }}>Nhập OTP</Text>
      <View style={styles.otpContainer}>
        {[...Array(6)].map((_, index) => (
          <RNTextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            keyboardType="numeric"
            maxLength={1}
            onChangeText={(value) => handleInputChange(index, value)}
            value={otp[index]}
            onFocus={() => inputRefs.current[index]?.setNativeProps({ selection: { start: 0, end: 1 } })}
          />
        ))}
      </View>
      <Text style={{ marginTop: 10, fontSize: 14, color: colors.gray }}>Mã OTP sẽ được gửi đến số {"+84 1231 23123"}</Text>

      <Text style={{
        marginTop: 10, alignSelf: 'flex-end',
        color: colors.primary, fontSize: 20
      }}>Gửi lại</Text>

      <View marginT-20 marginB-45>
        <AppButton
          type="primary"
          title={i18n.t('auth.register.title')}
          onPress={handleVerifyOTP}
          loading={false}
        />
        <AppButton title={i18n.t('back')} type="outline" marginT-12 onPress={() => router.back()} />
      </View>
    </View>

  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 50,
    height: 50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    textAlign: 'center',
    fontSize: 24,
    marginHorizontal: 5,
  },
});

export default OTP;
