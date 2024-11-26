import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { router } from 'expo-router';

export const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

export const setupNotificationHandler = () => {
    Notifications.setNotificationHandler({
        handleNotification: async (notification) => {

            return {
                shouldShowAlert: true,
                shouldPlaySound: true,
                shouldSetBadge: true
            };
        }
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        handleNotificationNavigation(data);
    });
};

export const handleNotificationNavigation = (data: any) => {
    try {
        const type = data?.type;

        switch (type) {
            case 'new_appointment':
            case 'appointment_status':
                router.push({
                    pathname: '/appointment/[id]',
                    params: { id: data?.appointment_id }
                });
                break;

            case 'new_order':
            case 'order_status':
                router.push({
                    pathname: '/(app)/order/[id]',
                    params: { id: data?.order_id }
                });
                break;

            case 'new_message':
                router.push({
                    pathname: '/chat/[id]',
                    params: { id: data?.conversation_id }
                });
                break;

            case 'payment':
                router.push('/notification');
                break;

            case 'promotion':
                router.push({
                    pathname: '/reward/[id]',
                    params: { id: data?.promotion_id }
                });
                break;

            case 'new_review':
                router.push({
                    pathname: '/rating/[id]',
                    params: { id: data?.review_id }
                });
                break;

            default:
                router.push('/notification');
                break;
        }
    } catch (error) {
        console.error('Navigation error:', error);
    }
};

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
    if (error) {
        console.error('Background notification task error:', error);
        return;
    }

    const notificationData = data as any;
    handleNotificationNavigation(notificationData);
}); 