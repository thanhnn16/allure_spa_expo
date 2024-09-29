import React, { useEffect } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationProp } from '@react-navigation/native';
import AppButton from '@/components/AppButton';
import { AppTextInput } from '@/components/AppTextInput';
import SendButton from '@/components/sendButton';
import BackButton from '@/components/backButton';

SplashScreen.preventAutoHideAsync();

interface RegisterProps {
  navigation: NavigationProp<any>;
}


const commonInputStyle = {
  width: 345,
  height: 45,
  borderRadius: 8,
  marginTop: Spacings.s3,
};

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'AlexBrush-Regular': require('@/assets/fonts/AlexBrush-Regular.ttf'),
    'OpenSans-Regular': require('@/assets/fonts/OpenSans-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <ImageBackground
      source={require('@/assets/images/authen/img_bg_authen.png')}
      style={{ flex: 1 }}
    >
      <View flex center>
        <Image
          width={250}
          height={85}
          source={require('@/assets/images/logo/nameAllure.png')}
        />
        <Text
          h2
          style={{
            textAlign: 'center',
            color: Colors.primary,
            fontFamily: 'AlexBrush-Regular',
            fontSize: 32,
            paddingEnd: 50,
          }}
        >
          Nghệ thuật chăm da
        </Text>
        <Text
          h2
          style={{
            textAlign: 'center',
            color: Colors.primary,
            fontFamily: 'AlexBrush-Regular',
            fontSize: 32,
            paddingStart: 50,
          }}
        >
          Từ nghệ nhân Nhật Bản
        </Text>
      </View>
      <View
        flexS
        center
        bg-secondary
        style={{
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingBottom: 12,
        }}
      >
        <AppTextInput
          title="Số điện thoại"
          placeholder="Nhập số điện thoại"
          containerStyle={{ ...commonInputStyle, marginBottom: 32, marginTop: 42 }}
          titleStyle={{
            fontSize: 16,
            fontFamily: 'OpenSans-Regular',
            color: Colors.primary,
          }}
          textInputStyle={{ height: 30, color: Colors.black }}
        />
        <AppTextInput
          title="Họ và tên"
          placeholder="Nhập họ và tên"
          containerStyle={{ ...commonInputStyle, marginBottom: 32, marginTop: 32 }}
          titleStyle={{
            fontSize: 16,
            fontFamily: 'OpenSans-Regular',
            color: Colors.primary,
          }}
          textInputStyle={{ height: 30, color: Colors.black }}
        />
        <SendButton
        title='Gửi mã OTP'
        />
        <BackButton
         title='Quay lại'
        />
        <Text
          center
          color={Colors.black}
          marginT-20
          marginB-100
          style={{ paddingHorizontal: Spacings.s6 }}
        >
          Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
          <Text color={Colors.black} style={{ fontWeight: 'bold' }}>
            Điều khoản sử dụng
          </Text>{' '}
          và{' '}
          <Text color={Colors.black} style={{ fontWeight: 'bold' }}>
            Chính sách bảo mật
          </Text>{' '}
          của chúng tôi
        </Text>
      </View>
    </ImageBackground>
  );
};

export default Register;
