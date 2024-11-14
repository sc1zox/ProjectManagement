import { AfterContentChecked, Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import {
  MatChipEditedEvent, MatChipInput,
  MatChipInputEvent,
  MatChipsModule
} from '@angular/material/chips';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatAccordion, MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import {DatePipe, NgForOf} from '@angular/common';
import { MatBadge } from '@angular/material/badge';
import { Project } from '../../../types/project';
import { User, UserRole } from '../../../types/user';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { NotificationsService } from '../../../services/notifications.service';
import { ProjectService } from '../../../services/project.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Skill } from '../../../types/skill';
import { SkillService } from '../../../services/skill.service';
import {UserSkillsComponent} from './user-skills/user-skills.component';

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
  imports: [
    MatLabel,
    MatChipInput,
    MatFormField,
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelHeader,
    MatAccordion,
    NgForOf,
    MatBadge,
    MatChipsModule,
    MatButton,
    RouterLink,
    UserSkillsComponent,
    DatePipe,
  ],
  standalone: true,
})

export class RightSidebarComponent implements OnInit, OnDestroy {
  userProject?: Project;
  notifications?: number;
  userInitials: string = '';
  user?: User;
  private projectPollingInterval: any;



  constructor(
    private readonly ProjectService: ProjectService,
    private readonly NotificationService: NotificationsService,
    private readonly UserService: UserService,
    private readonly AuthService: AuthService,
  ) {
    this.notifications = this.NotificationService.getNotificationAmount();
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
        }, 30000); // fetch current project every 30 seconds
      }
    } catch (error) {
      console.error('Error while fetching user or project:', error);
    } finally {
      console.log('Project fetch finished.');
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

  ngOnDestroy() {
    if (this.projectPollingInterval) {
      clearInterval(this.projectPollingInterval);
    }
  }

  triggerLogout() {
    this.AuthService.logout();
    window.location.reload();
  }
}
