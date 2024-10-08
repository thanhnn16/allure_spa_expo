import React, { useRef, useState } from 'react';
import { View, Text, Image, Alert, StyleSheet, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import { TextInput } from '@/components/inputs/TextInput';
import AppButton from '@/components/buttons/AppButton';
import Brand from '@/assets/images/common/logo-brand.svg';
import colors from '@/constants/Colors';
import Spacings from '@/constants/Spacings';
import { signInWithPhoneNumber } from 'firebase/auth';
import { auth } from '@/utils/services/firebase/firebaseService';
import { useRouter } from 'expo-router';
import { useConfirmation } from '@/utils/services/firebase/ConfirmationResult';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Register: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const { setConfirmation } = useConfirmation();
  const router = useRouter();

  const sendOTP = async () => {
    try {
      if (!phoneNumber) {
        Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
        return;
      }
    } catch (error) {
      console.error('Error sending OTP:', error);
      const errorMessage = (error as Error).message || 'Có lỗi xảy ra khi gửi OTP';
      Alert.alert('Lỗi', errorMessage);
    }
  };
  

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ImageBackground source={require('@/assets/images/authen/img_bg_authen.png')} style={{ flex: 1 }}>
        <View style={{ marginTop: 60 }}>
          <Brand width={250} height={85} />
          <Text style={{ textAlign: 'center', color: colors.primary, fontFamily: 'AlexBrush-Regular', fontSize: 32, marginTop: 10 }}>
            Nghệ thuật chăm da
          </Text>
          <Text style={{ textAlign: 'center', color: colors.primary, fontFamily: 'AlexBrush-Regular', fontSize: 32 }}>
            Từ nghệ nhân Nhật Bản
          </Text>
        </View>
        <View style={styles.container}>
          <TextInput
            title="Số điện thoại"
            placeholder="Nhập số điện thoại"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            title="Họ và tên"
            placeholder="Nhập họ và tên"
            value={fullName}
            onChangeText={setFullName}
          />
          <AppButton
            title="Gửi OTP"
            type="primary"
            onPress={sendOTP}
          />

          <AppButton title="Quay lại" type="outline" onPress={() => router.back()} />
          <Text style={{ textAlign: 'center', color: colors.black, marginTop: 20, marginBottom: 100, paddingHorizontal: Spacings.s6 }}>
            Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
            <Text style={{ fontWeight: 'bold' }}>Điều khoản sử dụng</Text> và{' '}
            <Text style={{ fontWeight: 'bold' }}>Chính sách bảo mật</Text> của chúng tôi
          </Text>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
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
});

export default Register;
