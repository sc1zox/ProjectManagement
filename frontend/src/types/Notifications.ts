export interface Notification {
  id?: number;
  message: string;
  timestamp?: Date;
  isRead: boolean;
  userId?: number;
}
