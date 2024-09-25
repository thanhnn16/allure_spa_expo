import React, { useEffect } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationProp } from '@react-navigation/native';
import AppButton from '@/components/AppButton';
import { AppTextInput } from '@/components/AppTextInput';

SplashScreen.preventAutoHideAsync();

interface RegisterProps {
  navigation: NavigationProp<any>;
}

// Load custom colors
Colors.loadColors({
  primary: '#717658',
  secondary: 'white',
  black: 'black',
});

const Register: React.FC<RegisterProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'AlexBrush-Regular': require('../../../assets/fonts/AlexBrush-Regular.ttf'),
    'OpenSans-Regular': require('../../../assets/fonts/OpenSans-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Prevent rendering before fonts are loaded
  }

  return (
    <ImageBackground
      source={require('../../../assets/images/authen/img_bg_authen.png')}
      style={{ flex: 1 }}
    >
      <View flex center>
        <Image
          source={require('../../../assets/images/logo/nameAllure.png')}
          width={250}
          height={85}
        />
        <Text
          marginT-10
          marginR-85
          style={{ fontFamily: 'AlexBrush-Regular', fontSize: 32, color: Colors.primary, textAlign: 'center' }}
        >
          Nghệ thuật chăm da
        </Text>
        <Text
          marginL-65
          style={{ fontFamily: 'AlexBrush-Regular', fontSize: 32, color: Colors.primary }}
        >
          Từ nghệ nhân Nhật Bản
        </Text>
      </View>
      <View
        flexS
        center
        bg-secondary
        style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 12 }}
      >
        <AppTextInput
          title="Số điện thoại"
          placeholder="Nhập số điện thoại"
          containerStyle={{ width: 345, height: 45, borderRadius: 8, marginBottom: 32, marginTop: 42 }}
          titleStyle={{ fontFamily: 'OpenSans-Bold', fontSize: 16, color: Colors.black }}
        />
        <AppTextInput
          title="Họ và tên"
          placeholder="Nhập họ và tên"
          containerStyle={{ width: 345, height: 45, borderRadius: 8, marginBottom: 12, marginTop: 32 }}
          titleStyle={{ fontFamily: 'OpenSans-Bold', fontSize: 16, color: Colors.black }}
        />
        <AppButton
          buttonStyle={{ width: 345, height: 50, borderRadius: 8, backgroundColor: Colors.primary, marginTop: 62 }}
          titleStyle={{ fontFamily: 'OpenSans-Regular', fontSize: 20, color: Colors.secondary }}
          title="Gửi mã OTP"
        />
        <AppButton
          buttonStyle={{ width: 345, height: 50, borderRadius: 8, backgroundColor: 'rgba(113, 118, 88, 0.2)', marginTop: 22 }}
          titleStyle={{ fontFamily: 'OpenSans-Regular', fontSize: 20, color: Colors.primary }}
          title="Quay lại"
        />
        <Text 
          style={{ textAlign: 'center', color: Colors.black, padding: Spacings.s2, marginTop: 20, marginBottom: 100 }}
        >
          Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
          <Text style={{ fontWeight: 'bold', color: Colors.black }}>Điều khoản sử dụng</Text> và{' '}
          <Text style={{ fontWeight: 'bold', color: Colors.black }}>Chính sách bảo mật</Text> của chúng tôi
        </Text>
      </View>
    </ImageBackground>
  );
};

export default Register;
