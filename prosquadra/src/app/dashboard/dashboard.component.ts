import {Component, HostListener, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {RightSidebarComponent} from './right-sidebar/right-sidebar.component';
import {LeftSidebarComponent} from './left-sidebar/left-sidebar.component';
import {NotificationsService} from '../../services/notifications.service';
import {UserService} from '../../services/user.service';
import {Notification} from '../../types/Notifications';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    RouterModule, RightSidebarComponent, LeftSidebarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  isExpanded: boolean = false; // Zustand der Sidebar
  notifications: Notification[] = [];

  constructor(private readonly NotificationsService: NotificationsService, private readonly UserService: UserService) {
  }

  async ngOnInit() {
    let user = await this.UserService.getCurrentUser();
    if (user)
      this.notifications = await this.NotificationsService.getNotificationsByUserId(user?.id)
    this.notifications.forEach((notification) => {
      if (!notification.isRead) {
        this.NotificationsService.showNotification(notification);
      }
    });

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (window.innerWidth < 1000) {
      this.isExpanded = false;
    }
  }
}
