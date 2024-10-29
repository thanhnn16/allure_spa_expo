import * as Notifications from 'expo-notifications';

export const scheduleAppointmentNotification = async (appointment: any) => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: 'Lịch hẹn mới',
            body: `Bạn có lịch hẹn mới vào ${appointment.timeSlot.start_time}`,
            data: { appointment },
        },
        trigger: null,
    });
};