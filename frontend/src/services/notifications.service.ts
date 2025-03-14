import {Injectable} from '@angular/core';
import {Notification} from '../types/Notifications';
import {ActiveToast, ToastrService} from 'ngx-toastr';
import {ApiService} from './api.service';
import {ApiResponse} from '../types/api-response';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  isMobile: boolean = false;
  private activeToasts: { [toastId: number]: number } = {}; //chatgpt.com

  constructor(
    private toastr: ToastrService,
    private apiService: ApiService,
  ) {
    this.isMobile = window.innerWidth < 1000;
  }

  showNotification(notification: Notification) {
    const toast: ActiveToast<any> = this.toastr.info(notification.message, 'New notification', {
      timeOut: 5000,
      positionClass: this.isMobile ? 'toast-bottom-center' : 'toast-bottom-right',
      closeButton: true,
      progressBar: true,
      newestOnTop: true,
    });

    toast.onHidden.subscribe(() => {
      if (notification.id) {
        try {
          this.markNotificationAsRead(notification.id);
        }catch (error){
          console.log("Something went wrong")
        }
      }
    });
  }

  showNotificationPermanent(notification: Notification): void {
    if (notification.id) {
      if (Object.values(this.activeToasts).includes(notification.id)) {
        return;
      }
      const toast: ActiveToast<any> = this.toastr.info(notification.message, 'New notification', {
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
          try {
            this.deleteNotification(notificationId);
          }catch (error){
            console.log("Something went wrong")
          }
          delete this.activeToasts[toast.toastId];
        }
      });
    }
  }


  async getNotificationsByUserId(userId: number): Promise<Notification[]> {
    try {
      const response: ApiResponse<Notification[]> = await this.apiService.fetch('/notifications/' + userId);
      return response.data;
    }catch (error){
      throw error;
    }
  }

  async markNotificationAsRead(notificationId: number): Promise<void> {
    try {
      const response: ApiResponse<void> = await this.apiService.putWithoutBody(`/notifications/read/` + notificationId);
      return response.data;
    }catch (error){
      throw error;
    }
  }

  async deleteNotification(notificationId: number): Promise<void> {
    try {
      const response: ApiResponse<void> = await this.apiService.delete(`/notifications/delete/` + notificationId);
      return response.data;
    }catch (error){
      throw error;
    }

  }

  async createNotification(notificationMessage: string, userId: number): Promise<Notification> {
    const notification: Notification = {
      message: notificationMessage,
      isRead: false,
      userId: userId,
    };
    try {
      const response: ApiResponse<Notification> = await this.apiService.post('/notifications/create', notification);

      return response.data;
    }catch (error){
      throw error;
    }
  }
}
