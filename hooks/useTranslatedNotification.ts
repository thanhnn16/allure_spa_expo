import { useSelector } from 'react-redux';
import { Notification } from '../redux/features/notification/types';
import { RootState } from '@/redux/store';

export const useTranslatedNotification = (notification: Notification) => {
    try {
        const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
        
        console.log('Current Language:', currentLanguage);
        console.log('Notification Data:', notification);
        console.log('Translations:', notification.translations);

        const getTranslatedField = (field: 'title' | 'content') => {
            if (!notification.translations) {
                console.log(`No translations found for ${field}, using default:`, notification[field]);
                return notification[field];
            }

            const translatedValue = notification.translations[field]?.[currentLanguage] || notification[field];
            console.log(`Translated ${field}:`, {
                currentLanguage,
                translatedValue,
                fallback: notification[field]
            });
            
            return translatedValue;
        };

        const result = {
            ...notification,
            title: getTranslatedField('title'),
            content: getTranslatedField('content')
        };

        console.log('Final translated notification:', result);
        return result;

    } catch (error) {
        console.error('Translation error:', error);
        return {
            ...notification,
            title: notification.title,
            content: notification.content
        };
    }
};