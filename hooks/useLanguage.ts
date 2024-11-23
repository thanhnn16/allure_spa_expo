import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import i18n from '@/languages/i18n';
import { getInitialLanguage } from '@/languages/i18n';

export const useLanguage = () => {
    // Get initial language from device settings
    let currentLanguage = getInitialLanguage();

    // Try to get language from Redux store if available
    try {
        const storeLanguage = useSelector(
            (state: RootState) => state.language.currentLanguage
        );
        if (storeLanguage) {
            currentLanguage = storeLanguage;
        }
    } catch (error) {
        // Fallback to device language if Redux store is not available
    }

    // Set i18n locale
    if (currentLanguage) {
        i18n.locale = currentLanguage;
    }

    const t = (key: string, options?: any) => {
        try {
            return i18n.t(key, options);
        } catch (error) {
            console.error('Translation error:', error);
            return key;
        }
    };

    return {
        currentLanguage,
        t
    };
}; 