import React, { useRef, useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground } from 'react-native';
import { TextInput as RNTextInput } from 'react-native';
import AppButton from '@/components/buttons/AppButton';
import Brand from '@/assets/images/common/logo-brand.svg';
import colors from "@/constants/Colors";
import Spacings from '@/constants/Spacings';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  const verifyOTP = async () => {
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ImageBackground
          source={require('@/assets/images/authen/img_bg_authen.png')}
          style={{ flex: 1 }}
        >
          <View  style={{ marginTop: 60 }}>
           
            <Text style={{ fontFamily: 'AlexBrush-Regular', fontSize: 32, color: colors.primary, textAlign: 'center', marginTop: 10 }}>
              Nghệ thuật chăm da
            </Text>
            <Text style={{ fontFamily: 'AlexBrush-Regular', fontSize: 32, color: colors.primary }}>
              Từ nghệ nhân Nhật Bản
            </Text>
          </View>

          <View style={styles.container}>
            <Text style={{ marginBottom: 20, fontSize: 20, fontWeight: 'bold' }}>Nhập OTP</Text>
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
            <AppButton
              title="Gửi lại"
              type="outline"
              onPress={() => {
                Alert.alert('Thông báo', 'Gửi lại OTP chưa được triển khai.');
              }}
            />
            <AppButton
              title="Xác nhận"
              type="primary"
              onPress={verifyOTP}
            />
            <AppButton
              title="Quay lại"
              type="secondary"
              onPress={() => router.back()}
            />
            <Text style={{ textAlign: 'center', marginTop: 20, marginBottom: 50 }}>
              Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
              <Text style={{ fontWeight: 'bold' }}>Điều khoản sử dụng</Text> và{' '}
              <Text style={{ fontWeight: 'bold' }}>Chính sách bảo mật</Text> của chúng tôi
            </Text>
          </View>
        </ImageBackground>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
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
