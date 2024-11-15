export type NotificationType = 'success' | 'cancel' | 'reschedule' | 'new_order' | 'new_appointment' | 'new_review';

export interface Notification {
  id: string;
  title: string;
  content: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  url?: string;
  data?: any;
}