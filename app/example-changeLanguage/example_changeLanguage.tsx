import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Localization from 'expo-localization';
import i18n from '@/assets/languages/i18n'

const Example_ChangeLanguage = () => {
  const [currentLanguage, setCurrentLanguage] = useState(i18n.locale);

  useEffect(() => {
    // Cập nhật ngôn ngữ hiện tại khi component mount
    const deviceLanguage: any = Localization.getLocales()[0].languageCode;
    console.log(deviceLanguage)

    if (Object.keys(i18n.translations).includes(deviceLanguage)) {
      setCurrentLanguage(deviceLanguage);
    }
  }, []);

  const changeLanguage = (language: string) => {
    i18n.locale = language;
    setCurrentLanguage(language);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{i18n.t('welcome')}</Text>

      <View style={styles.content}>
        <Text>{i18n.t('language')}: {currentLanguage}</Text>
        <Text>{i18n.t('settings')}</Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => changeLanguage('en')}
        >
          <Text>English</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => changeLanguage('vi')}
        >
          <Text>Tiếng Việt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => changeLanguage('ja')}
        >
          <Text>日本語</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity>
          <Text>{i18n.t('login')}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>{i18n.t('logout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Example_ChangeLanguage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
});
