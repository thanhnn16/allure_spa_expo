import { I18n } from 'i18n-js';
import en from './translations/en.json';
import vi from './translations/vi.json';
import ja from './translations/ja.json';
import { getLocales } from "expo-localization";

const translations = {
  en: en,
  vi: vi,
  ja: ja,
};

const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export const getInitialLanguage = () => {
  const deviceLanguage = getLocales()[0].languageCode;
  return translations[deviceLanguage] ? deviceLanguage : 'en';
};

export default i18n;
