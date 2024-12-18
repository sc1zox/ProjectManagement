import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { SnackbarService } from '../../../services/snackbar.service';
import { User, UserRole } from '../../../types/user';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { UrlaubComponent } from '../../components/urlaub/urlaub.component';
import { MatIcon } from '@angular/material/icon';
import { slideIn } from '../../../animations/slideIn';
import { Urlaub, vacationState } from '../../../types/urlaub';
import { MatExpansionPanel, MatExpansionPanelHeader } from '@angular/material/expansion';
import { NgProgressbar, NgProgressRef } from 'ngx-progressbar';
import {NotificationsService} from '../../../services/notifications.service';

@Component({
  selector: 'app-urlaub-overview',
  standalone: true,
  imports: [
    NgForOf,
    UrlaubComponent,
    NgIf,
    MatIcon,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    NgProgressbar,
    AsyncPipe
  ],
  animations: [
    slideIn
  ],
  templateUrl: './urlaub-overview.component.html',
  styleUrls: ['./urlaub-overview.component.scss']
})
// Implementation mit Hilfe von Copilot
export class UrlaubOverviewComponent implements OnInit {

  allUser: User[] = [];
  groupedVacations = new Map<User, { accepted: Urlaub[], waiting: Urlaub[], denied: Urlaub[] }>();
  groupedVacationsSignal = signal<Map<User, { accepted: Urlaub[], waiting: Urlaub[], denied: Urlaub[] }>>(new Map());
  userCollapseState: Map<User, boolean> = new Map();
  @ViewChild(NgProgressRef) progressBar!: NgProgressRef;

  constructor(private readonly UserService: UserService,
              private readonly SnackBarService: SnackbarService,
              private readonly NotificationService: NotificationsService,
  ) {
  }

  async ngOnInit() {
    await this.loadUsers();
  }

  private async loadUsers() {
    try {
      let tmpUsers: User[] = await this.UserService.getUsers();
      this.allUser = tmpUsers.filter(user => user.role !== UserRole.Bereichsleiter && user.role !== UserRole.Admin);
      this.groupVacationsByStatus();
      this.allUser.forEach(user => this.userCollapseState.set(user, false));
    } catch (error) {
      this.SnackBarService.open('Konnte Urlaub nicht laden');
    }
  }

  groupVacationsByStatus() {
    this.allUser.forEach(user => {
      const grouped: { accepted: Urlaub[], waiting: Urlaub[], denied: Urlaub[] } = {
        accepted: [],
        waiting: [],
        denied: []
      };

      user.urlaub?.forEach(vacation => {
        if (vacation.stateOfAcception === vacationState.Accepted) {
          grouped.accepted.push(vacation);
        } else if (vacation.stateOfAcception === vacationState.Waiting) {
          grouped.waiting.push(vacation);
        } else if (vacation.stateOfAcception === vacationState.Denied) {
          grouped.denied.push(vacation);
        }
      });

      this.groupedVacations.set(user, grouped);
    });
    this.groupedVacationsSignal.set(this.groupedVacations);
  }

  async denyUrlaub(urlaub: Urlaub) {
    this.progressBar.start();
    try {
      if (urlaub.id) {
        await this.UserService.deleteUrlaub(urlaub);
        this.SnackBarService.open('Urlaub wurde abgelehnt');
        await this.NotificationService.createNotification('Ihr Urlaub wurde abgelehnt',urlaub.userId,false)

        this.groupedVacations.forEach((vacations, user) => {
          vacations.accepted = vacations.accepted.filter(v => v.id !== urlaub.id);
          vacations.waiting = vacations.waiting.filter(v => v.id !== urlaub.id);
          vacations.denied.push(urlaub);
        });

        this.groupedVacationsSignal.set(this.groupedVacations);
      } else {
        throw new Error('urlaubId not defined');
      }
    } catch (error) {
      this.progressBar.complete();
      this.SnackBarService.open('Status konnte nicht geupdated werden!');
    } finally {
      this.progressBar.complete();
    }
  }

  async acceptUrlaub(urlaub: Urlaub) {
    this.progressBar.start();
    try {
      if (urlaub.id) {
        await this.UserService.updateVacationState(urlaub.id, vacationState.Accepted);
        this.SnackBarService.open('Urlaub wurde akzeptiert');
        await this.NotificationService.createNotification('Ihr Urlaub wurde akzeptiert',urlaub.userId,false)

        this.groupedVacations.forEach((vacations, user) => {
          if (user.urlaub?.some(v => v.id === urlaub.id)) {
            vacations.accepted = vacations.accepted.filter(v => v.id !== urlaub.id);
            vacations.waiting = vacations.waiting.filter(v => v.id !== urlaub.id);
            vacations.denied.push(urlaub);
          }
        });

        await this.loadUsers();
        this.groupedVacationsSignal.set(this.groupedVacations);

      } else {
        throw new Error('urlaubId not defined');
      }
    } catch (error) {
      this.progressBar.complete();
      this.SnackBarService.open('Status konnte nicht geupdated werden!');
    } finally {
      this.progressBar.complete();
    }
  }

  protected readonly UserRole = UserRole;
}
