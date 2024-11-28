import { useSelector } from 'react-redux';
import { Notification } from '@/redux/features/notification/types';
import { RootState } from '@/redux/store';

export const useTranslatedNotification = (notification: Notification) => {
    try {
        const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

        const getTranslatedField = (field: 'title' | 'content') => {
            if (!notification.translations) {
                return notification[field];
            }

            const translatedValue = notification.translations[field]?.[currentLanguage] || notification[field];

            return translatedValue;
        };

        const result = {
            ...notification,
            title: getTranslatedField('title'),
            content: getTranslatedField('content')
        };
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