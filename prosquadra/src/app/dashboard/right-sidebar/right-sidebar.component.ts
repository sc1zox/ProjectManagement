import {AfterContentChecked, Component, inject, OnInit, signal} from '@angular/core';
import {
  MatChipEditedEvent,
  MatChipGrid,
  MatChipInput,
  MatChipInputEvent,
  MatChipRow,
  MatChipsModule
} from '@angular/material/chips';
import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatIcon} from '@angular/material/icon';
import {
  MatAccordion,
  MatExpansionPanel,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';
import {NgForOf} from '@angular/common';
import {MatBadge} from '@angular/material/badge';
import {Project} from '../../../types/project';
import {User, UserRole} from '../../../types/user';
import {MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NotificationsService} from '../../../services/notifications.service';
import {ProjectService} from '../../../services/project.service';
import {UserService} from '../../../services/user.service';

export interface ProgrammingLanguage {
  name: string
}

@Component({
  selector: 'app-right-sidebar',
  templateUrl: './right-sidebar.component.html',
  styleUrl: './right-sidebar.component.scss',
  imports: [
    MatLabel,
    MatChipRow,
    MatChipGrid,
    MatFormField,
    MatIcon,
    MatChipInput,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatAccordion,
    NgForOf,
    MatBadge,
    MatExpansionPanelHeader,
    MatChipsModule,
    MatButton,
    RouterLink,
  ],
  standalone: true,
})

export class RightSidebarComponent implements OnInit {

  userProject?: Project;
  notifications?: number;
  userInitials: string = '';
  user?: User;

  constructor(private readonly ProjectService: ProjectService,private readonly NotificationService: NotificationsService,private readonly UserService: UserService) {
    this.notifications = this.NotificationService.getNotificationAmount();
  }

  async ngOnInit() {
    try {
      this.user = await this.UserService.getCurrentUser();
      if (this.user) {
        this.userInitials = this.user.vorname.charAt(0).toUpperCase() + this.user.nachname.charAt(0).toUpperCase();
      }

      // Fetch user project
      this.userProject = await this.ProjectService.getProjectsById(1);
    } catch (error) {
      console.error('Error while fetching user or project:', error);
    } finally {
      console.log('Project fetch finished.');
    }
  }


  // Source https://material.angular.io/components/chips/examples

  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly result = signal<ProgrammingLanguage[]>([{name: 'HTML'}, {name: 'CSS'}, {name: 'JAVASCRIPT'}]);
  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();


    if (value) {
      this.result.update(pls => [...pls, {name: value}]);
    }


    event.chipInput!.clear();
  }

  remove(pl: ProgrammingLanguage): void {
    this.result.update(pls => {
      const index = pls.indexOf(pl);
      if (index < 0) {
        return pls;
      }

      pls.splice(index, 1);
      this.announcer.announce(`Removed ${pl.name}`);
      return [...pls];
    });
  }

  edit(pl: ProgrammingLanguage, event: MatChipEditedEvent) {
    const value = event.value.trim();


    if (!value) {
      this.remove(pl);
      return;
    }


    this.result.update(pls => {
      const index = pls.indexOf(pl);
      if (index >= 0) {
        pls[index].name = value;
        return [...pls];
      }
      return pls;
    });
  }
}
