import {Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {User, UserRole} from '../../../../types/user';
import {UserService} from '../../../../services/user.service';
import {SnackbarService} from '../../../../services/snackbar.service';
import {MatCard, MatCardActions, MatCardTitle} from '@angular/material/card';
import {NotificationsService} from '../../../../services/notifications.service';

@Component({
  selector: 'app-mitarbeiter-delete',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    RouterLink,
    NgForOf,
    MatCard,
    MatCardTitle,
    MatCardActions,
    MatButton
  ],
  templateUrl: './mitarbeiter-delete.component.html',
  styleUrl: './mitarbeiter-delete.component.scss'
})
export class MitarbeiterDeleteComponent implements OnInit{

  users: User[] = [];
  bereichsLeiter: User[] = [];

  constructor(private readonly UserService: UserService,
              private readonly SnackBarService: SnackbarService,
              private readonly NotificationService: NotificationsService) {
  }

  async ngOnInit() {
    try {
      this.users = await this.UserService.getUsers();
      this.bereichsLeiter = this.UserService.getBereichsleiter(this.users)
      this.removeAdminUndBL();
    }catch (error){
      this.SnackBarService.open('Could not retrieve user!');
    }
  }

  async deleteUser(userId: number) {
    try {
      let deletedUser = await this.UserService.getUser(userId);
      await this.UserService.deleteUser(userId);
      this.SnackBarService.open('The user has been successfully deleted!')
      for(let b of this.bereichsLeiter) {
        await this.NotificationService.createNotification(`The user ${deletedUser.vorname} ${deletedUser.nachname} has been deleted`,b.id)
      }
      this.users = await this.UserService.getUsers();
      this.removeAdminUndBL();
    } catch (error) {
      this.SnackBarService.open('Could not delete the user!')
    }
  }

  removeAdminUndBL(){
    this.users = this.users.filter(user => user.role !== UserRole.Bereichsleiter && user.role !== UserRole.Admin);
  }
}
