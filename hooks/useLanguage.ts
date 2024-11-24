import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '@/languages/i18n';
import { getInitialLanguage } from '@/languages/i18n';

const LANGUAGE_KEY = '@app_language';

export const useLanguage = () => {
    const [currentLanguage, setCurrentLanguage] = useState(getInitialLanguage());

    useEffect(() => {
        // Load saved language when component mounts
        const loadSavedLanguage = async () => {
            try {
                const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
                if (savedLanguage) {
                    setCurrentLanguage(savedLanguage);
                    i18n.locale = savedLanguage;
                }
            } catch (error) {
                console.error('Error loading language:', error);
            }
        };
        
        loadSavedLanguage();
    }, []);

    const changeLanguage = async (language: string) => {
        try {
            await AsyncStorage.setItem(LANGUAGE_KEY, language);
            setCurrentLanguage(language);
            i18n.locale = language;
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

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
        changeLanguage,
        t
    };
}; 