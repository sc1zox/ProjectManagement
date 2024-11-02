import { Injectable } from '@angular/core';
import {Notification} from '../types/Notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

// Example usage
  notifications: Notification[] = [
    {
      id: 1,
      message: 'Your profile has been updated successfully.',
      timestamp: new Date(),
      isRead: false
    },
    {
      id: 2,
      message: 'There was an error processing your request.',
      timestamp: new Date(),
      isRead: false
    }
  ]


  constructor() { }

  getNotificationAmount(){
    return this.notifications.length;
  }
}
