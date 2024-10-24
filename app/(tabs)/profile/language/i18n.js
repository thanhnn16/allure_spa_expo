
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Các tệp ngôn ngữ
const resources = {
  en: {
    translation: {
      my_account: "My Account",
      edit_personal_info: "Edit personal information",
      purchase_policy: "Purchase and return policy",
      policy_description: "Policy applicable to Allure Spa",
      order_address: "Order address",
      address_list: "Address list",
      logout: "Logout",
      help_support: "Help & Support",
      about_app: "About the App",
      settings: "Settings",
      more: "More",
      // Thêm các từ khóa khác
    }
  },
  vi: {
    translation: {
      my_account: "Tài khoản của tôi",
      edit_personal_info: "Chỉnh sửa thông tin cá nhân",
      purchase_policy: "Chính sách mua hàng, đổi trả",
      policy_description: "Chính sách áp dụng cho Allure Spa",
      order_address: "Địa chỉ đặt hàng",
      address_list: "Danh sách địa chỉ",
      logout: "Đăng xuất",
      help_support: "Trợ giúp & Hỗ trợ",
      about_app: "Giới thiệu về ứng dụng",
      settings: "Cài đặt",
      more: "More",
      // Thêm các từ khóa khác
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'vi', // Ngôn ngữ mặc định
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
