import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '@/redux/features/language/languageSlice';
import i18n, { setI18nConfig } from '@/languages/i18n';
import { RootState } from '@/redux/store';

export const useLanguage = () => {
    try {
        const dispatch = useDispatch();
        const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

        const changeLanguage = async (language: string) => {
            try {
                await setI18nConfig(language);
                dispatch(setLanguage(language));
            } catch (error) {
                console.error('Error changing language:', error);
            }
        };

        return {
            changeLanguage,
            currentLanguage,
            t: i18n.t,
        };
    } catch (error) {
        console.error('Redux context not available:', error);
        return {
            changeLanguage: async () => {},
            currentLanguage: 'en',
            t: i18n.t,
        };
    }
}; 