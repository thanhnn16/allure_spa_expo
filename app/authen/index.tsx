import React, { useRef, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Animated, Dimensions, Alert } from 'react-native';
import { View, Image, Text, Colors, Modal, TouchableOpacity } from 'react-native-ui-lib';
import { Link } from 'expo-router/build/link/Link';
import i18n from '@/languages/i18n';
import LoginForm from './form/LoginForm';
import RegisterForm from './form/RegisterForm';
import LoginZaloForm from './form/LoginZaloForm';
import OTP from './otp';
import AppButton from '@/components/buttons/AppButton';
import Brand from '@/assets/images/common/logo-brand.svg';
import axios from 'axios';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '@/redux/language/LanguageSlice';
import { RootReducerType } from '@/redux/ReduxStore';
const { width, height } = Dimensions.get('window');

const Onboarding: React.FC = () => {
  const dispatch = useDispatch();

  const currentLanguage = useSelector((state: RootReducerType) => state.language?.currentLanguage ?? 'en');
  const [activeView, setActiveView] = useState<'default' | 'login' | 'register' | 'zalo' | 'otp'>('default');

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [, forceUpdate] = useState({});

  const fadeAnim = useRef(new Animated.Value(1)).current;
  const translateYAnim = useRef(new Animated.Value(0)).current;

  const animateViewChange = (newView: 'default' | 'login' | 'register' | 'zalo' | 'otp') => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 10,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setActiveView(newView);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleViewChange = (newView: 'default' | 'login' | 'register' | 'zalo' | 'otp') => {
    animateViewChange(newView);
  };

  const updateLanguage = (nextLanguage: string) => {
    i18n.locale = nextLanguage;
    dispatch(setLanguage(nextLanguage));
    setModalVisible(false);
  };

  const toggleLanguage = () => {
    const nextLanguage = currentLanguage === 'en' ? 'ja' : currentLanguage === 'ja' ? 'vi' : 'en';
    updateLanguage(nextLanguage);
  };

  const handleRegisterPress = async () => {
    try {
      const response = await axios.post('/api/auth/register', {
        phone_number: phoneNumber,
        full_name: fullName,
        password: password,
        password_confirmation: password,
      });

      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        handleViewChange('login');
      }
    } catch (error) {
      const err = error as any;
      if (err.response) {
        Alert.alert('Error', err.response.data.message || 'Registration failed');
      } else {
        Alert.alert('Error', 'Network error, please try again');
      }
    }
  };

  const handleLoginPress = async () => {
    try {
      const response = await axios.post('/api/auth/login', {
        phone_number: phoneNumber,
        password: password,
      });

      if (response.status === 200) {
        Alert.alert('Success', response.data.message);
        console.log('Navigating to Home...');
        router.push('/(tabs)/home'); // Ensure the path is correct
      }
    } catch (error) {
      const err = error as any;
      if (err.response) {
        Alert.alert('Error', err.response.data.message || 'Login failed');
      } else {
        Alert.alert('Error', 'Network error, please try again');
      }
    }
  };

  const handlesendOtpPress = () => {
    handleViewChange('otp');
  };

  const handleBackPress = () => {
    handleViewChange('default');
  };

  const renderForm = () => {
    switch (activeView) {
      case 'login':
        return <LoginForm onBackPress={() => handleViewChange('default')} />;
      case 'register':
        return <RegisterForm onBackPress={() => handleViewChange('default')} />;
      case 'zalo':
        return <LoginZaloForm onBackPress={() => handleViewChange('default')} />;
      case 'otp':
        return <OTP onBackPress={() => handleViewChange('default')} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    i18n.locale = currentLanguage;
    forceUpdate({});
  }, [currentLanguage]);

  const renderSelectLanguage = (key: string) => {
    switch (key) {
      case 'en':
        return 'English';
      case 'vi':
        return 'Tiếng Việt';
      case 'ja':
        return '日本語';
      default:
        return 'English';
    }
  }

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <Image
            source={require('@/assets/images/authen/img_bg_authen.png')}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              opacity: 0.5,
            }}
          />
          <View paddingT-48 centerH marginB-16>
            <Image source={Brand} style={{ width: width * 0.6, height: height * 0.1 }} />
            <Text center marginR-85 onboarding_title>
              {i18n.t('auth.art.title')}
            </Text>
            <Text center marginL-65 onboarding_title>
              {i18n.t('auth.art.subtitle')}
            </Text>
          </View>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
              backgroundColor: 'white',
              width: '100%',
              paddingHorizontal: 24,
              paddingTop: 32,
              paddingBottom: 20,
              position: 'absolute',
              bottom: 0,
              borderTopLeftRadius: 30,
              borderTopRightRadius: 30,
            }}
          >
            {activeView === 'default' ? (
              <View>
                <AppButton title={i18n.t('auth.register.title')} type="primary" onPress={() => handleViewChange('register')} />
                <AppButton title={i18n.t('auth.login.title')} type="primary" onPress={() => handleViewChange('login')} />
                <AppButton title={i18n.t('auth.login.zalo')} type="outline" onPress={() => handleViewChange('zalo')} />
                <AppButton title={i18n.t('change_language')} type="outline" onPress={toggleLanguage} />
                <Link href="/(tabs)/home" asChild>
                  <AppButton title={i18n.t('auth.login.skip')} type="text" />
                </Link>
              </View>
            ) : (
              renderForm()
            )}
            <Text center text80>
              {i18n.t('auth.login.by_continue')}
              <Text text80H> {i18n.t('auth.login.terms')} </Text>
              {i18n.t('auth.login.and')}
              <Text text80H> {i18n.t('auth.login.privacy')} </Text>
              {i18n.t('auth.login.of_us')}
            </Text>
          </Animated.View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Onboarding;
