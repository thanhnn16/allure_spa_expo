import React, { useEffect } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationProp } from '@react-navigation/native';
import AppButton from '@/components/AppButton'; 
import { AppTextInput } from '@/components/AppTextInput';

SplashScreen.preventAutoHideAsync();

interface LoginProps {
  navigation: NavigationProp<any>;
}

// Load custom colors
Colors.loadColors({
  primary: '#717658',
  secondary: 'white',
  black: 'black',
});

// Common styles
const commonButtonStyle = {
  width: 345,
  height: 50,
  borderRadius: 8,
  marginTop: 12,
};

const commonInputStyle = {
  width: 345,
  height: 45,
  borderRadius: 8,
  marginTop: 12,
};

const Login: React.FC<LoginProps> = ({ navigation }) => {
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
      style={{ flex: 1 }} // Directly setting flex in the component
    >
      <View flex center>
        <Image
          width={250}
          height={85}
          source={require('../../../assets/images/logo/nameAllure.png')}
        />
        <Text
          marginT-10
          marginR-85
          style={{ fontFamily: 'AlexBrush-Regular', color: Colors.primary, textAlign: 'center', fontSize: 32 }}
        >
          Nghệ thuật chăm da
        </Text>
        <Text
          marginL-65
          style={{ fontFamily: 'AlexBrush-Regular', color: Colors.primary, textAlign: 'center', fontSize: 32 }}
          >
          Từ nghệ nhân Nhật Bản
        </Text>
      </View>
      <View
        flexS
        center
        bg-secondary
        paddingB-12
        style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
      >
        <AppTextInput
          title="Số điện thoại"
          placeholder="Nhập số điện thoại"
          containerStyle={{ ...commonInputStyle, marginBottom: 32, marginTop: 32 }}
          titleStyle={{
            fontSize: 16,
            fontFamily: 'OpenSans-Regular',
          }}
          textInputStyle={{ height: 30 }} 
        />
        <AppTextInput
          title="Mật khẩu"
          placeholder="Nhập mật khẩu"
          containerStyle={{ ...commonInputStyle, marginBottom: 22, marginTop: 22 }}
          titleStyle={{
            fontSize: 16,
            fontFamily: 'OpenSans-Regular',
          }}
          textInputStyle={{ height: 30 }}
          secureTextEntry
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', width: 345, marginTop: 42, marginBottom: 12 }}>
          <Text style={{ color: Colors.primary, fontSize: 16 }}>Quên mật khẩu?</Text>
        </View>
        <AppButton
          buttonStyle={{ ...commonButtonStyle, backgroundColor: Colors.primary }}
          titleStyle={{ fontFamily: 'OpenSans-Regular', fontSize: 20, color: Colors.secondary }}
          title="Đăng nhập"
        />
        <AppButton
          buttonStyle={{ ...commonButtonStyle, backgroundColor: 'rgba(113, 118, 88, 0.2)' }}
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

export default Login;
