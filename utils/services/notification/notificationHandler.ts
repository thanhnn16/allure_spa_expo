import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { router } from 'expo-router';

export const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK';

export const setupNotificationHandler = () => {
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: true,
            shouldSetBadge: true,
        }),
    });

    Notifications.addNotificationResponseReceivedListener((response) => {
        handleNotificationNavigation(response.notification.request.content.data);
    });
};

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, ({ data, error }) => {
    if (error) {
        console.error('Background notification task error:', error);
        return;
    }

    const notificationData = data as any;
    handleNotificationNavigation(notificationData);
});

const handleNotificationNavigation = (data: any) => {
    try {
        const type = data?.type;
        const notificationId = data?.notification_id;

        switch (type) {
            case 'new_appointment':
            case 'appointment_status':
                // router.push(`/appointments/${data?.appointment_id}`);
                break;

            case 'new_order':
            case 'order_status':
                // router.push(`/(app)/order/${data?.order_id}`);
                break;

            case 'new_message':
                router.push(`/chat/${data?.conversation_id}`);
                break;

            case 'payment':
                // router.push(`/payments/${data?.payment_id}`);
                break;

            case 'promotion':
                // router.push(`/reward/${data?.promotion_id}`);
                break;

            case 'new_review':
                // router.push(`/reviews/${data?.review_id}`);
                break;

            default:
                router.push(`/notification`);
                break;
        }
    } catch (error) {
        console.error('Navigation error:', error);
    }
}; 