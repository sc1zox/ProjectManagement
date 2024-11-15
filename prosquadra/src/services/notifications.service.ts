import { Injectable } from '@angular/core';
import { Notification } from '../types/Notifications';
import {ActiveToast, ToastrService} from 'ngx-toastr';
import { ApiService } from './api.service';
import {ApiResponse} from '../types/api-response';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  private activeToasts: { [toastId: number]: number } = {}; //chatgpt.com
  isMobile: boolean = false;

  constructor(
    private toastr: ToastrService,
    private apiService: ApiService
  ) {
    this.isMobile = window.innerWidth < 1000;
  }

  showNotification(notification: Notification) {
    this.toastr.info(notification.message, 'Neue Benachrichtigung', {
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      closeButton: true,
      progressBar: true,
      newestOnTop: true,
    });
  }

  showNotificationPermanent(notification: Notification): void {
    if (notification.id) {
      if (Object.values(this.activeToasts).includes(notification.id)) {
        return;
      }
      const toast: ActiveToast<any> = this.toastr.info(notification.message, 'Neue Benachrichtigung', {
        timeOut: 0,
        closeButton: true,
        positionClass: this.isMobile ? 'toast-bottom-center' : 'toast-bottom-right',
        progressBar: false,
        tapToDismiss: false,
        extendedTimeOut: 0,
      });

      this.activeToasts[toast.toastId] = notification.id;

      toast.onHidden.subscribe(() => {
        const notificationId = this.activeToasts[toast.toastId];
        if (notificationId) {
          this.markNotificationAsRead(notificationId);
          delete this.activeToasts[toast.toastId];
        }
      });
    }
  }


  async getNotificationsByUserId(userId: number): Promise<Notification[]> {

    const response: ApiResponse<Notification[]> = await this.apiService.fetch('/notifications/' + userId);

    if (response.code !== 200) {
      throw new Error('Failed to fetch notifications for specific id:' + userId);
    }

    return response.data;
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    const response: ApiResponse<void> = await this.apiService.post(`/notifications/read/` + notificationId, {
      method: 'PUT',
    });

    if (response.code !== 200) {
      throw new Error('Failed to mark notification as read: ' + notificationId);
    }
  }

  async deleteNotification(notificationId: number): Promise<void> {
    const response: ApiResponse<void> = await this.apiService.post(`/notifications/delete/` + notificationId, {
      method: 'DELETE',
    });

    if (response.code !== 200) {
      throw new Error('Failed to delete notification: ' + notificationId);
    }
  }

  // hier einen return type definieren? anstatt any?
  async createNotification(notificationMessage: string, userId: number): Promise<ApiResponse<any>> {
    const notification: Notification = {
      message: notificationMessage,
      isRead: false,
      userId: userId,
    };

    const response: ApiResponse<any> = await this.apiService.post('/notifications/create',notification);

    if (response.code !== 201) {
      throw new Error('Failed to create notification');
    }

    return response.data;
  }
}
