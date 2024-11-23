import { I18n } from 'i18n-js';
import en from './translations/en.json';
import vi from './translations/vi.json';
import ja from './translations/ja.json';
import { getLocales } from "expo-localization";

const i18n = new I18n({
  en,
  vi,
  ja
});

// Enable fallback
i18n.enableFallback = true;

// Set default locale
i18n.defaultLocale = 'en';

// Set initial locale based on device language
const deviceLanguage = getLocales()[0].languageCode;
i18n.locale = deviceLanguage && ['en', 'vi', 'ja'].includes(deviceLanguage) ? deviceLanguage : 'en';

export const setI18nConfig = (language: string) => {
  return new Promise((resolve) => {
    i18n.locale = language;
    resolve(true);
  });
};

export const getInitialLanguage = () => {
  const deviceLanguage = getLocales()[0].languageCode;
  return ['en', 'vi', 'ja'].includes(deviceLanguage || '') ? deviceLanguage : 'en';
};

export default i18n;
