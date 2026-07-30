export interface Notification {
  _id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  created_at: string;
  updated_at: string;
  id: string;
}

export interface GetNotificationsResponse {
  success: boolean;
  notifications: Notification[];
  unreadCount: number;
}
