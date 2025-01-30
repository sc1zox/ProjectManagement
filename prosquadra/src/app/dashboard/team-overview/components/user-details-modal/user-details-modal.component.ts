import {Component, Inject, OnInit} from '@angular/core';
import {User, UserRole} from '../../../../../types/user';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {Team} from '../../../../../types/team';
import {TeamService} from '../../../../../services/team.service';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {SnackbarService} from '../../../../../services/snackbar.service';
import {BehaviorSubject} from 'rxjs';
import {UserService} from '../../../../../services/user.service';

@Component({
  selector: 'app-user-details-modal',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    MatButton,
    AsyncPipe,
  ],
  templateUrl: './user-details-modal.component.html',
  styleUrl: './user-details-modal.component.scss'
})
export class UserDetailsModalComponent implements OnInit {

  teams: Team[] = [];
  arbeitszeit? = new BehaviorSubject<number>(0);
  currentUser?: User;
  user?: User;
  isAdminOrBl: boolean = false;
  protected readonly UserRole = UserRole;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User, currentUser: User },
              private readonly dialogRef: MatDialogRef<UserDetailsModalComponent>, private readonly TeamService: TeamService,private readonly SnackBarService: SnackbarService,private readonly UserService: UserService) {
    this.user = data.user;
    this.currentUser = data.currentUser;
  }

  async ngOnInit() {
    this.user = this.data.user;
    this.currentUser = this.data.currentUser;
    if (this.currentUser) {
      try {
        this.teams = await this.TeamService.getTeamsByUserId(this.user.id)
      }catch (error){
        this.SnackBarService.open('Could not load user')
      }
    }

    if (this.currentUser?.role === UserRole.Admin  || this.currentUser?.role === UserRole.Bereichsleiter) {
      this.isAdminOrBl = true;
    }
    if (this.arbeitszeit && this.user.arbeitszeit) {
      this.arbeitszeit.next(this.user.arbeitszeit);
    }
  }

  updateArbeitszeit(value: number) {
    if(this.arbeitszeit) {
      this.arbeitszeit.next(value);
    }
    if(this.user && this.arbeitszeit && this.arbeitszeit.value !== null) {
      try {
        this.UserService.updateArbeitszeit(this.user.id, this.arbeitszeit.value)
      } catch (error){
        this.SnackBarService.open('Working hours could not be updated')
      }
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
