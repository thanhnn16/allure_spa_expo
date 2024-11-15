import React, { useEffect } from 'react';
import { View, Text } from 'react-native-ui-lib';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { fetchUnreadCount } from '@/redux/features/notification/notificationThunks';

const NotificationBadge: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const unreadCount = useSelector((state: RootState) => state.notification.unreadCount);

    useEffect(() => {
        dispatch(fetchUnreadCount());
    }, [dispatch]);

    if (unreadCount === 0) return null;

    return (
        <View 
            style={{
                position: 'absolute',
                top: -5,
                right: -5,
                backgroundColor: 'red',
                borderRadius: 10,
                minWidth: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Text white text70>
                {unreadCount > 99 ? '99+' : unreadCount}
            </Text>
        </View>
    );
};

export default NotificationBadge; 