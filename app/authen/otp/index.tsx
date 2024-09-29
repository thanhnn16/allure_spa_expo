import React, { useEffect, useRef } from 'react';
import { View, Image, Text, Colors, Spacings } from 'react-native-ui-lib';
import { TextInput, ImageBackground } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationProp } from '@react-navigation/native';
import SendButton from '@/components/sendButton';
import BackButton from '@/components/backButton';
import colors from "@/rn/colors";

SplashScreen.preventAutoHideAsync();

interface OTPProps {
  navigation: NavigationProp<any>;
}

const OTP: React.FC<OTPProps> = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'AlexBrush-Regular': require('@/assets/fonts/AlexBrush-Regular.ttf'),
    'OpenSans-Regular': require('@/assets/fonts/OpenSans-Regular.ttf'),
  });

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
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
      source={require('@/assets/images/authen/img_bg_authen.png')}
      style={{ flex: 1 }}
    >
      <View flex center>
        <Image
          source={require('@/assets/images/logo/nameAllure.png')}
          width={250}
          height={85}
        />
        <Text
          marginR-50
          style={{ fontFamily: 'AlexBrush-Regular', fontSize: 32, color: colors.primary, textAlign: 'center'}}
        >
          Nghệ thuật chăm da
        </Text>
        <Text
          marginL-65
          style={{ fontFamily: 'AlexBrush-Regular', fontSize: 32, color: colors.primary }}
        >
          Từ nghệ nhân Nhật Bản
        </Text>
      </View>

      {/* OTP Input Section */}
      <View
        flexS
        bg-secondary
        paddingB-12
        style={{ borderTopLeftRadius: 30, borderTopRightRadius: 30 }}
      >
        <Text
          text60BO
          marginL-20
          marginT-20
          style={{ fontFamily: 'OpenSans-Regular', fontSize: 16, color: Colors.black }}
        >
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
                  marginHorizontal: 5,
                  fontFamily: 'OpenSans-Regular',
                }}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(value) => handleInputChange(index, value)}
                onFocus={() => inputRefs.current[index]?.setNativeProps({ selection: { start: 0, end: 1 } })}
              />
            ))}
          </View>

          <View row spread marginT-20 marginL-12>
            <Text text14 color={Colors.gray} style={{ fontFamily: 'OpenSans-Regular' }}>
              Mã OTP sẽ được gửi đến số 0123 456 789
            </Text>
            <SendButton 
              title="Gửi lại"
              buttonStyle={{
                width: 80,
                height: 40,
                borderRadius: 8,
                backgroundColor: 'transparent',
              }}
              titleStyle={{
                color: Colors.primary,
                fontSize: 16,
                fontFamily: 'OpenSans-Regular',
              }}
            />
          </View>

          <SendButton
            title="Xác nhận"
          />
          <BackButton
            title="Quay lại"
          />
        </View>

        <Text center color-black marginT-20 marginB-100 style={{ paddingHorizontal: 20 }}>
          Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
          <Text color-black style={{ fontWeight: 'bold' }}>Điều khoản sử dụng</Text> và{' '}
          <Text color-black style={{ fontWeight: 'bold' }}>Chính sách bảo mật</Text> của chúng tôi
        </Text>
      </View>
    </ImageBackground>
  );
};

export default OTP;
