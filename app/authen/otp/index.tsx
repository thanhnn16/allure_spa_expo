import React, { useRef } from 'react';
import { View, Image, Text, Colors, Spacings, Button } from 'react-native-ui-lib';
import { TextInput, ImageBackground } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { NavigationProp } from '@react-navigation/native';
import SendButton from '@/components/buttons/AppButton';
import BackButton from '@/components/buttons/AppButton';
import colors from "@/constants/Colors";
import { Link } from 'expo-router';

import Brand from '@/assets/images/common/logo-brand.svg';

SplashScreen.preventAutoHideAsync();

interface OTPProps {
  navigation: NavigationProp<any>;
}

const OTP: React.FC<OTPProps> = ({ navigation }) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

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
      <View center>
        <Image
          width={250}
          height={85}
          source={Brand}
        />
        <Text
          marginR-50
          style={{ fontFamily: 'AlexBrush-Regular', fontSize: 32, color: colors.primary, textAlign: 'center' }}
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
        style={{
          backgroundColor: colors.white,
          borderTopLeftRadius: 30,
          borderTopRightRadius: 30,
          paddingBottom: 20,
          paddingTop: 40,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
        }}
      >
        <Text
          text60BO
          marginL-20
          marginT-20
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

          <View left>
            <Text text14 color={Colors.gray} style={{ fontFamily: 'OpenSans-Regular' }}>
              Mã OTP sẽ được gửi đến số 0123 456 789
            </Text>
          </View>

          <View left>
            <Button
              link
              text70BO
              right
              color={Colors.primary}
              label="Gửi lại"
            />
          </View>

          {/* <SendButton
            title="Xác nhận"
          />
          <Link href="/authen/register" asChild>
            <BackButton
              title='Quay lại'
            />
          </Link> */}
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
