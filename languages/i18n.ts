import { I18n } from 'i18n-js';
import en from './translations/en.json';
import vi from './translations/vi.json';
import ja from './translations/ja.json';
import { getLocales } from "expo-localization";

const translations = {
  en,
  vi,
  ja
};

const i18n = new I18n(translations);

i18n.enableFallback = true;
i18n.defaultLocale = 'en';

const deviceLanguage = getLocales()[0].languageCode;
i18n.locale = deviceLanguage && ['en', 'vi', 'ja'].includes(deviceLanguage) ? deviceLanguage : 'en';
console.log('deviceLanguage', deviceLanguage);

export const setI18nConfig = (language: string) => {
  i18n.locale = language;
  return Promise.resolve(true);
};

export const getInitialLanguage = () => {
  const deviceLanguage = getLocales()[0].languageCode;
  return ['en', 'vi', 'ja'].includes(deviceLanguage || '') ? deviceLanguage : 'en';
};

export const translate = (key: string, options?: object) => {
  return i18n.t(key, options);
};

export default i18n;
