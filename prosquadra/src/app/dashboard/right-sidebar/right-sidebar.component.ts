import {Component, OnDestroy, OnInit} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {DatePipe, NgIf} from '@angular/common';
import {MatBadge} from '@angular/material/badge';
import {Project} from '../../../types/project';
import {User} from '../../../types/user';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NotificationsService} from '../../../services/notifications.service';
import {ProjectService} from '../../../services/project.service';
import {UserService} from '../../../services/user.service';
import {AuthService} from '../../../services/auth.service';
import {UserSkillsComponent} from './user-skills/user-skills.component';
import {Notification} from '../../../types/Notifications';
import {QrCodeModule} from 'ng-qrcode';
import {ApiService} from '../../../services/api.service';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
  imports: [
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatAccordion,
    MatBadge,
    MatChipsModule,
    MatButton,
    RouterLink,
    UserSkillsComponent,
    DatePipe,
    MatIconButton,
    QrCodeModule,
    NgIf,
  ],
  standalone: true,
})

export class RightSidebarComponent implements OnInit, OnDestroy {
  userProject?: Project;
  notificationsAmount?: number;
  notifications: Notification[] = [];
  userInitials: string = '';
  user?: User;
  private projectPollingInterval: any;
  QrCodeVisible: boolean = false


  constructor(
    private readonly ProjectService: ProjectService,
    private readonly NotificationService: NotificationsService,
    private readonly UserService: UserService,
    private readonly AuthService: AuthService,
    private readonly ApiService: ApiService,
  ) {

  }

// the current project fetch only works for roles other then SM as SM can have multiple teams. Maybe display something else for SM here
  async ngOnInit() {
    try {
      this.user = await this.UserService.getCurrentUser();
      if (this.user) {
        console.log('Der aktuelle Nutzer', this.user);
        this.userInitials = this.user.vorname.charAt(0).toUpperCase() + this.user.nachname.charAt(0).toUpperCase();
        await this.fetchProject();

        this.projectPollingInterval = setInterval(() => {
          this.fetchProject();
          this.fetchNotifications();
        }, 10000); // fetch current project + unread notifications every 10 seconds
      }
    } catch (error) {
      console.error('Error while fetching user or project:', error);
    } finally {
      console.log('Project fetch finished.');
    }
    if (this.user) {
      this.notifications = await this.NotificationService.getNotificationsByUserId(this.user?.id)
      this.notificationsAmount = this.notifications.length;
    }
  }

  async fetchProject() {
    try {
      if (this.user) {
        this.userProject = await this.ProjectService.getProjectWithLowestPriorityByUserId(this.user.id);
      }
    } catch (error) {
      console.error('Error fetching project:', error);
    }
  }

  async fetchNotifications() {
    try {
      if (this.user) {
        this.notifications = await this.NotificationService.getNotificationsByUserId(this.user.id);
        this.notificationsAmount = this.notifications.length;
        this.notifications.forEach((notification) => {
          if (!notification.isRead) {
            this.NotificationService.showNotification(notification);
          }
        });
      }
    } catch (error) {
      console.log("error fetching notifications")
    }
  }

  ngOnDestroy() {
    if (this.projectPollingInterval) {
      clearInterval(this.projectPollingInterval);
    }
  }

  triggerLogout() {
    this.AuthService.logout();
    window.location.reload();
  }

  showNotifications() {
    if (this.notifications)
      this.notifications.forEach((notification) => {
        this.NotificationService.showNotificationPermanent(notification);
      });
  }

  getPdfUrl() {
    return this.ApiService.getApiUrl() + '/export/' + this.user?.id
  }

  showQrCode() {
    this.QrCodeVisible = !this.QrCodeVisible;
  }

  getPDF() {
    window.location.href = this.getPdfUrl();
  }
}
