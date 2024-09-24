import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import en from './en.json';
import vi from './vi.json';
import ja from './ja.json';

const i18n = new I18n({
  en,
  vi,
  ja,
});

i18n.enableFallback = true;
i18n.translations = { en, vi, ja };

// Sử dụng getLocales() thay vì locale
const deviceLanguage = Localization.getLocales()[0].languageCode;

// Kiểm tra xem ngôn ngữ của thiết bị có trong danh sách ngôn ngữ hỗ trợ không
if (Object.keys(i18n.translations).includes(deviceLanguage)) {
  i18n.locale = deviceLanguage;
} else {
  i18n.locale = 'en'; // Mặc định là tiếng Anh nếu không tìm thấy ngôn ngữ phù hợp
}

export default i18n;