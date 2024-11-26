import { useSelector } from 'react-redux';
import { Notification } from '../redux/features/notification/types';
import { RootState } from '@/redux/store';

export const useTranslatedNotification = (notification: Notification) => {
    try {
        const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);

        const getTranslatedField = (field: 'title' | 'content') => {
            if (!notification.translations) {
                return notification[field];
            }

            return notification.translations[field]?.[currentLanguage] || notification[field];
        };

        return {
            ...notification,
            title: getTranslatedField('title'),
            content: getTranslatedField('content')
        };
    } catch (error) {
        console.error('Redux context not available:', error);
        return {
            ...notification,
            title: notification.title,
            content: notification.content
        };
    }
};