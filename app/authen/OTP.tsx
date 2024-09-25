import React, { useEffect, useRef } from 'react';
import { View, Image, Text, Colors } from 'react-native-ui-lib';
import { TextInput, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationProp } from '@react-navigation/native';
import AppButton from '@/components/AppButton';

SplashScreen.preventAutoHideAsync();

interface OTPProps {
  navigation: NavigationProp<any>;
}

// Load custom colors
Colors.loadColors({
  primary: '#717658',
  secondary: 'white',
  black: 'black',
  gray: '#AAAAAA',
});

const commonButtonStyle = {
  width: 345,
  height: 50,
  borderRadius: 8,
  marginTop: 12,
};

const OTP: React.FC<OTPProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'AlexBrush-Regular': require('../../../assets/fonts/AlexBrush-Regular.ttf'),
    'OpenSans-Regular': require('../../../assets/fonts/OpenSans-Regular.ttf'),
  });

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Prevent rendering before fonts are loaded
  }

  const handleInputChange = (index: number, value: string) => {
    if (value) {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    } else if (index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

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
          style={{ fontFamily: 'AlexBrush-Regular', fontSize: 32, color: Colors.primary }}
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

      <View flexS bg-secondary style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingBottom: 12 }}>
        <Text text60BO marginL-20 marginT-20>
          Nhập OTP
        </Text>
        
        <View center marginT-12>
          <View row>
            {[...Array(6)].map((_, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={{ 
                  width: 50, 
                  height: 50, 
                  borderRadius: 8, 
                  borderWidth: 1, 
                  borderColor: Colors.primary, 
                  textAlign: 'center', 
                  fontSize: 24, 
                  marginHorizontal: 5 
                }}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(value) => handleInputChange(index, value)}
                onFocus={() => inputRefs.current[index]?.setNativeProps({ selection: { start: 0, end: 1 } })}
              />
            ))}
          </View>

          <View row spread marginT-20 marginL-12>
            <Text text14 style={{ color: 'gray' }}>
              Mã OTP sẽ được gửi đến số 0123 456 789
            </Text>
            <AppButton
              buttonStyle={{ 
                width: 80, 
                height: 40, 
                borderRadius: 8, 
                backgroundColor: 'transparent' 
              }}
              titleStyle={{ 
                color: Colors.primary, 
                fontSize: 16, 
                fontFamily: 'OpenSans-Regular' 
              }}
              title="Gửi lại"
            />
          </View>

          <AppButton
            buttonStyle={{ ...commonButtonStyle, backgroundColor: Colors.primary, marginTop: 12 }}
            titleStyle={{ color: Colors.secondary }}
            title="Gửi mã OTP"
          />
          <AppButton
            buttonStyle={{ ...commonButtonStyle, backgroundColor: 'rgba(113, 118, 88, 0.2)', marginTop: 22 }}
            titleStyle={{ color: Colors.primary }}
            title="Quay lại"
          />
        </View>

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

export default OTP;
