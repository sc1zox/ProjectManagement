import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatChipsModule} from '@angular/material/chips';
import {MatIcon} from '@angular/material/icon';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatBadge} from '@angular/material/badge';
import {Project} from '../../../types/project';
import {User, UserRole} from '../../../types/user';
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
import {SnackbarService} from '../../../services/snackbar.service';
import {NgProgressbar, NgProgressRef} from 'ngx-progressbar';
import {catchError, interval, startWith, Subscription, switchMap} from 'rxjs';


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
    NgForOf,
    NgProgressbar,
  ],
  standalone: true,
})

export class RightSidebarComponent implements OnInit, OnDestroy {
  userProject?: Project;
  userProjects: Project[] =[];
  notificationsAmount: number = 0;
  notifications: Notification[] = [];
  userInitials: string = '';
  user?: User;
  noTeamAndProject: boolean = false;
  QrCodeVisible: boolean = false
  pollingSubscription!: Subscription;
  loading: boolean = true;
  @ViewChild(NgProgressRef) progressBar!: NgProgressRef;


  constructor(
    private readonly ProjectService: ProjectService,
    private readonly NotificationService: NotificationsService,
    private readonly UserService: UserService,
    private readonly AuthService: AuthService,
    private readonly ApiService: ApiService,
    private readonly SnackBarService: SnackbarService,
  ) {

  }

  async ngOnInit() {
    try {
      this.user = await this.UserService.getCurrentUser();
      if (this.user) {
        this.userInitials = this.user.vorname.charAt(0).toUpperCase() + this.user.nachname.charAt(0).toUpperCase();
        if (this.user.role === UserRole.Admin || this.user.role === UserRole.Bereichsleiter) {
          this.noTeamAndProject = true;
          this.startPolling();
          return;
        }
        this.startPolling();
      }
    } catch (error) {
      console.error('Error while fetching user or project:', error);
    } finally {
      this.loading = false;
    }
  }

  startPolling() {
    this.pollingSubscription = interval(10000)
      .pipe(
        startWith(0),
        switchMap(() => this.fetchData()),
        catchError((error) => {
          console.error('Error during polling:', error);
          return [];
        })
      )
      .subscribe();
  }

  async fetchData() {
    try {
      await Promise.all([this.fetchProject(), this.fetchNotifications()]);
    } catch (error) {
      console.error('Error fetching data during polling:', error);
    }finally {
      this.loading =false;
    }
  }

  async fetchProject() {
    try {
      if (this.user && (this.user.role !== UserRole.Bereichsleiter && this.user.role !== UserRole.Admin)) {
        const response: Project[] = await this.ProjectService.getProjectWithLowestPriorityByUserId(this.user.id)
        if(Array.isArray(response)){
          this.userProjects = response;
        }else{
          this.userProject = response;
        }
      }
    } catch (error) {
      console.log(error);
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
      console.log(error)
    }
  }

  ngOnDestroy() {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }

  triggerLogout() {
    this.AuthService.logout();
    window.location.reload();
  }

  showNotifications() {
    if (this.notifications)
      if(this.notificationsAmount === 0){
        this.SnackBarService.open('No notifications available');
      }
      this.notifications.forEach((notification) => {
        this.NotificationService.showNotificationPermanent(notification);
      });
  }

  getPdfUrlUser() {
    return this.ApiService.getApiUrl() + '/export/user/' + this.user?.id
  }
  getPdfUrlRoadmap() {
    return this.ApiService.getApiUrl() + '/export/roadmap/' + this.user?.id
  }

  showQrCode() {
    this.QrCodeVisible = !this.QrCodeVisible;
  }

  getPdfUser() {
    this.progressBar.start();
    try {
      window.location.href = this.getPdfUrlUser();
    }catch (error){
      this.SnackBarService.open('PDF could not be loaded')
      this.progressBar.complete();
    }finally {
      this.progressBar.complete();
    }
  }

  getPdfRoadmap() {
    this.progressBar.start();
    try {
      window.location.href = this.getPdfUrlRoadmap();
    }catch (error){
      this.SnackBarService.open('PDF could not be loaded')
      this.progressBar.complete();
    }finally {
      this.progressBar.complete();
    }
  }

  protected readonly UserRole = UserRole;
}
