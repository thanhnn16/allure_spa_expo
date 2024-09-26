import React, { useEffect } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationProp } from '@react-navigation/native';
import AppButton from '@/components/AppButton'; 
import SendButton from '@/components/sendButton';

SplashScreen.preventAutoHideAsync();

interface OnboardingProps {
  navigation: NavigationProp<any>;
}

const commonButtonStyle = {
  width: 345,
  height: 50,
  borderRadius: 8,
  marginTop: 18,
};

const styles = {
  backgroundImage: { flex: 1 },
  logo: {
    width: 350,
    height: 115,
  },
  titleText: {
    fontFamily: 'AlexBrush-Regular',
    fontSize: 32,
    color: Colors.primary,
  },
  footerText: {
    textAlign: 'center',
    color: Colors.black,
    padding: Spacings.s2,
    fontSize: 14,
    marginBottom: 42,

  },
  boldText: {
    fontWeight: 'bold',
    color: Colors.black,
  },
};

const Onboarding: React.FC<OnboardingProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'AlexBrush-Regular': require('../../assets/fonts/AlexBrush-Regular.ttf'),
    'OpenSans-Regular': require('../../assets/fonts/OpenSans-Regular.ttf'),
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
      source={require('../../../assets/images/authen/img_bg_authen.png')}
      style={styles.backgroundImage}
    >
      <View center>
        <Image
          source={require('../../../assets/images/logo/nameAllure.png')}
          style={styles.logo}
        />
        <Text
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
            style={{
              backgroundColor: Colors.secondary,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
              paddingBottom: 20,
              paddingTop: 40,
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              alignItems: 'center',
            }}
          >
   <SendButton
   title='Đăng ký'
   />
  <SendButton
   title='Đăng nhập'
   />
  <AppButton
    buttonStyle={{
      ...commonButtonStyle,
      backgroundColor: Colors.secondary,
      borderWidth: 2,
      borderColor: Colors.primary,
    }}
    titleStyle={{ color: Colors.primary, fontFamily: 'OpenSans-Regular', fontSize: 20 }}
    title="Đăng nhập bằng Zalo"
  />
  <AppButton
    buttonStyle={{
      ...commonButtonStyle,
      backgroundColor: Colors.secondary,
      borderWidth: 2,
      borderColor: Colors.primary,
    }}
    titleStyle={{ color: Colors.primary, fontFamily: 'OpenSans-Regular', fontSize: 20 }}
    title="Languages"
  />
  <AppButton
    titleStyle={{
      color: Colors.black,
      fontSize: 14,
      fontFamily: 'OpenSans-Regular',
      textDecorationLine: 'underline',
      paddingTop: Spacings.s2,
    }}
    title="Khám phá sau"
  />
  <Text center color-black marginT-20 marginB-100 style={{ paddingHorizontal: 20 }}>
          Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
          <Text color-black style={{ fontWeight: 'bold' }}>Điều khoản sử dụng</Text> và{' '}
          <Text color-black style={{ fontWeight: 'bold' }}>Chính sách bảo mật</Text> của chúng tôi
        </Text>
</View>

    </ImageBackground>
  );
};

export default Onboarding;
