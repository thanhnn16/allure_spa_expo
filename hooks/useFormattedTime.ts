import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useLanguage } from '@/hooks/useLanguage';
import moment from 'moment';
import 'moment/locale/vi';
import 'moment/locale/ja';

export const useFormattedTime = (timestamp: number) => {
    const currentLanguage = useSelector((state: RootState) => state.language.currentLanguage);
    const { t } = useLanguage();

    // Set locale for moment based on current language
    moment.locale(currentLanguage);

    const time = moment.unix(timestamp);
    const now = moment();

    // Custom relative time formatting based on language
    if (time.isSame(now, 'day')) {
        const diffInHours = now.diff(time, 'hours');
        if (diffInHours < 1) {
            const diffInMinutes = now.diff(time, 'minutes');
            return t('time.minutes_ago', { minutes: diffInMinutes });
        }
        return t('time.hours_ago', { hours: diffInHours });
    }

    if (time.isSame(now.subtract(1, 'day'), 'day')) {
        return t('time.yesterday');
    }

    if (time.isSame(now, 'week')) {
        return t('time.days_ago', { days: now.diff(time, 'days') });
    }

    return time.format('DD/MM/YYYY');
}; 