import React, { useRef, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Animated, Dimensions, Alert } from 'react-native';
import { View, Image, Text, Colors, Modal, TouchableOpacity } from 'react-native-ui-lib';
import { Link } from 'expo-router/build/link/Link';
import i18n from '@/languages/i18n';
import LoginForm from './form/LoginForm';
import RegisterForm from './form/RegisterForm';
import LoginZaloForm from './form/LoginZaloForm';
import AppButton from '@/components/buttons/AppButton';
import Brand from '@/assets/images/common/logo-brand.svg';
import axios from 'axios';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '@/redux/language/LanguageSlice';

const { width, height } = Dimensions.get('window');

const Onboarding: React.FC = () => {
  const dispatch = useDispatch();

  const currentLanguage = useSelector((state: any) => state.language?.currentLanguage ?? 'en');
  const [viewState, setViewState] = useState('default');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [, forceUpdate] = useState({});

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    Animated.timing(translateYAnim, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [viewState]);

  const handleButtonClick = (newState: string) => {
    setViewState(newState);
  };

  useEffect(() => {
    i18n.locale = currentLanguage;
    forceUpdate({});
  }, [currentLanguage]);

  const changeLanguage = (nextLanguage: string) => {
    dispatch(setLanguage(nextLanguage));
    setModalVisible(false);
  };

  const renderSelectLanguage = (key: string) => {
    switch (key) {
      case 'en':
        return 'English';
      case 'vi':
        return 'Tiếng Việt';
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
          <View paddingT-40 centerH marginB-16>
            <Image
              source={Brand}
              style={{ width: width * 0.6, height: height * 0.1 }}
            />
            <Text
              text50BO
              center
              marginR-85
              style={{ fontFamily: 'AlexBrush-Regular', color: Colors.primary }}
            >
              {i18n.t('auth.art.title')}
            </Text>
            <Text
              text50BO
              center
              marginL-65
              style={{ fontFamily: 'AlexBrush-Regular', color: Colors.primary }}
            >
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
            {viewState === 'default' ? (

              <View>
                <AppButton
                  title={i18n.t('auth.register.title')}
                  type="primary"
                  onPress={() => handleButtonClick('register')}
                />
                <AppButton
                  title={i18n.t('auth.login.title')}
                  type="primary"
                  onPress={() => handleButtonClick('login')}
                />
                <AppButton
                  title={i18n.t('auth.login.zalo')}
                  type="secondary"
                  onPress={() => handleButtonClick('changed')}
                />
                <AppButton
                  title={i18n.t('change_language')}
                  type="secondary"
                  onPress={() => {
                    setModalVisible(true);
                    // const nextLanguage =
                    //   currentLanguage === 'en'
                    //     ? 'ja'
                    //     : currentLanguage === 'ja'
                    //       ? 'vi'
                    //       : 'en';
                    // changeLanguage(nextLanguage);
                  }}
                />
                <Link href="/(tabs)/home" asChild>
                  <AppButton title={i18n.t('auth.login.skip')} type="text" />
                </Link>
              </View>
            ) : viewState === 'login' ? (
              <LoginForm
                phoneNumber={phoneNumber}
                password={password}
                setPhoneNumber={setPhoneNumber}
                setPassword={setPassword}
                onZaloPress={() => { }}
                onLoginPress={() => {
                  return axios.post('/api/auth/login', {
                    phone_number: phoneNumber,
                    password: password,
                  })
                    .then((response) => {
                      if (response.status === 200) {
                        Alert.alert('Success', response.data.message);
                        // Handle successful login (e.g., navigate to the home screen)
                      }
                    })
                    .catch((error) => {
                      const err = error as any;
                      if (err.response) {
                        Alert.alert('Error', err.response.data.message || 'Login failed');
                      } else {
                        Alert.alert('Error', 'Network error, please try again');
                      }
                    });
                }}
                onBackPress={() => handleButtonClick('default')}
              />
            ) : viewState === 'register' ? (
              <RegisterForm
                phoneNumber={phoneNumber}
                fullName={''}
                password={password}
                setPhoneNumber={setPhoneNumber}
                setFullName={() => { }}
                setPassword={setPassword}
                onRegisterPress={() => {
                  function backToLogin() {
                    handleButtonClick('login');
                  }

                  return axios.post('/api/auth/register', {
                    phone_number: phoneNumber,
                    password: password,
                  })
                    .then((response) => {
                      if (response.status === 200) {
                        Alert.alert('Success', response.data.message);
                        // Handle successful registration (e.g., navigate to the login screen)
                        backToLogin();
                      }
                    })
                    .catch((error) => {
                      const err = error as any;
                      if (err.response) {
                        Alert.alert('Error', err.response.data.message || 'Registration failed');
                      } else {
                        Alert.alert('Error', 'Network error, please try again');
                      }
                    });
                }}
                onBackPress={() => handleButtonClick('default')}
              />
            ) : viewState === 'zalo' ? (
              <LoginZaloForm
                phoneNumber={''}
                fullName={''}
                setPhoneNumber={() => { }}
                setPassword={() => { }}
                onZaloPress={() => { }}
                onLoginPress={() => {

                }}
                onBackPress={() => handleButtonClick('default')}
              />
            ) : null}

            <Text center text80>
              {i18n.t('auth.login.by_continue')}
              <Text text80H> {i18n.t('auth.login.terms')} </Text>
              {' '}
              {i18n.t('auth.login.and')}
              {' '}
              <Text text80H>{i18n.t('auth.login.privacy')}</Text>
              {' '} {i18n.t('auth.login.of_us')}
            </Text>
          </Animated.View>

          <Modal 
          visible={modalVisible}
          transparent={true} 
          animationType='fade' 
          >
            <View flex center backgroundColor='rgba(0, 0, 0, 0.5)'  >
              <View  center backgroundColor='white' style={{ padding: 30, borderRadius: 10, gap: 10,  }}>
                {Object.keys(i18n.translations).map((key) => (
                  <TouchableOpacity key={key} onPress={() => changeLanguage(key)}>
                    <Text>{renderSelectLanguage(key)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Modal>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Onboarding;
