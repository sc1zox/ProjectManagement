import {Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatList, MatListItem} from '@angular/material/list';
import {NgForOf} from '@angular/common';
import {User, UserRole} from '../../../../types/user';
import {UserService} from '../../../../services/user.service';
import {SnackbarService} from '../../../../services/snackbar.service';
import {MatCard, MatCardActions, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-mitarbeiter-delete',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    RouterLink,
    MatList,
    MatListItem,
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

  constructor(private readonly UserService: UserService,private readonly SnackBarService: SnackbarService) {
  }

  async ngOnInit() {
    try {
      this.users = await this.UserService.getUsers();
      this.removeAdminUndBL();
    }catch (error){
      this.SnackBarService.open('Konnte Nutzer nicht abrufen');
    }
  }

  async deleteUser(userId: number) {
    try {
      await this.UserService.deleteUser(userId);
      this.SnackBarService.open('Der Nutzer wurde erfolgreich gelöscht')
      this.users = await this.UserService.getUsers();
      this.removeAdminUndBL();
    } catch (error) {
      this.SnackBarService.open('Konnte den Nutzer nicht löschen')
    }
  }

  removeAdminUndBL(){
    this.users = this.users.filter(user => user.role !== UserRole.Bereichsleiter && user.role !== UserRole.Admin);
  }
}
