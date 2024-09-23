import React, { useEffect } from 'react';
import { View, StyleSheet, ImageBackground, Image, Text, TouchableOpacity } from 'react-native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { AppTextInput } from '@/components/AppTextInput';
import AppButton from '@/components/AppButton';
import { NavigationProp } from '@react-navigation/native';

SplashScreen.preventAutoHideAsync();

interface OnboardingProps {
    navigation: NavigationProp<any>;
}

export const Onboarding: React.FC<OnboardingProps> = ({ navigation }) => {
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
        return null;
    }

    return (
        <ImageBackground source={require('../../../assets/images/authen/img_bg_authen.png')}
        style={styles.background}>
            <View style={styles.container}>
                <Image
                    style={styles.imgName}
                    source={require('../../../assets/images/logo/nameAllure.png')}
                />
                <Text style={styles.txtTitleTop}>Chào mừng đến với Allure</Text>
                <Text style={styles.txtTitleBottom}>Hãy bắt đầu hành trình của bạn</Text>
            </View>
            <View style={styles.container2}>
                <AppButton buttonStyle={styles.btn1} titleStyle={styles.btn1Text} title="Đăng ký" />
                <AppButton buttonStyle={styles.btn2} titleStyle={styles.btn1Text} title="Đăng nhập" />
                <AppButton buttonStyle={styles.btn3} titleStyle={styles.btn3Text} title="Đăng nhập bằng Zalo" />
                <AppButton buttonStyle={styles.btn4} titleStyle={styles.btn3Text} title="Languages" />
                <AppButton titleStyle={styles.txtLoginLater} title="Khám phá sau" />
                <Text style={styles.termsText}>
                    Bằng cách tiếp tục, bạn sẽ đồng ý với{' '}
                    <Text style={styles.boldText} >
                        Điều khoản sử dụng
                    </Text>{' '}
                    và{' '}
                    <Text style={styles.boldText} >
                        Chính sách bảo mật
                    </Text>{' '}
                    của chúng tôi
                </Text>
            </View>
        </ImageBackground>
    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    imgName: {
        width: 350,
        height: 200,
    },
    txtTitleTop: {
        fontSize: 32,
        color: '#717658',
        fontFamily: 'AlexBrush-Regular ',
        marginRight: 90, 
        marginTop: -50,
    },
    txtTitleBottom: {
        fontSize: 32,
        color: '#717658',
        fontFamily: 'AlexBrush-Regular',
        marginLeft: 50,
        marginTop: 5,
    },
    container2: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    btn1: {
        width: 345,
        height: 50,
        marginTop: 50,
        backgroundColor: '#717658',
        borderRadius: 16,
        justifyContent: 'center', 
        alignItems: 'center', // Center the text horizontally
    },
    btn1Text: {
        color: 'white',
        fontSize: 16,
    },
    btn3: {
        width: 345,
        height: 50,
        marginTop: 12,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#717658', // Replace with your desired color
    },
    btn3Text: {
        color: '#717658', // Ensure the text color matches the border color
        fontSize: 16,
    },
    btn2: {
        width: 345,
        height: 50,
        marginTop: 12,
        backgroundColor: '#717658',
        borderRadius: 16,
        justifyContent: 'center', 
        alignItems: 'center', // Center the text horizontally
    },
    btn4: {
        width: 345,
        height: 50,
        marginTop: 12,
        backgroundColor: 'white',
        borderRadius: 16,
        borderWidth: 3,
        borderColor: '#717658',
    },
    txtLoginLater: {
        marginTop: 15,
        color: '#717658',
        fontSize: 14,
    },
    termsText: {
        marginTop: 15,
        textAlign: 'center',
        color: '#717658',
        fontSize: 14,
        marginEnd: 30,
        marginStart: 30,
    },
    boldText: {
        fontWeight: 'bold',
        color: '#717658',
    },
});

export default Onboarding;