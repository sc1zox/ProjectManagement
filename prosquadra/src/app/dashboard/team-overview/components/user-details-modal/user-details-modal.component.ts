import {Component, Inject, OnInit} from '@angular/core';
import {User, UserRole} from '../../../../../types/user';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForOf, NgIf} from '@angular/common';
import {Team} from '../../../../../types/team';
import {TeamService} from '../../../../../services/team.service';
import {FormsModule} from '@angular/forms';
import {MatButton} from '@angular/material/button';
import {SnackbarService} from '../../../../../services/snackbar.service';

@Component({
  selector: 'app-user-details-modal',
  standalone: true,
  imports: [
    NgForOf,
    FormsModule,
    NgIf,
    MatButton,
  ],
  templateUrl: './user-details-modal.component.html',
  styleUrl: './user-details-modal.component.scss'
})
export class UserDetailsModalComponent implements OnInit {

  teams: Team[] = [];
  arbeitszeit?: number;
  currentUser?: User;
  user?: User;
  isAdmin: boolean = false;
  protected readonly UserRole = UserRole;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { user: User, currentUser: User },
              private readonly dialogRef: MatDialogRef<UserDetailsModalComponent>, private readonly TeamService: TeamService,private readonly SnackBarService: SnackbarService) {
    this.user = data.user;
    this.currentUser = data.currentUser;
  }

  async ngOnInit() {
    this.user = this.data.user;
    this.currentUser = this.data.currentUser;
    if (this.currentUser) {
      try {
        this.teams = await this.TeamService.getTeamsByUserId(this.currentUser.id)
      }catch (error){
        this.SnackBarService.open('Konnte Nutzer nicht laden')
      }
    }

    if (this.currentUser?.role === UserRole.Admin) {
      this.isAdmin = true;
    }
  }

  closeModal() {
    this.dialogRef.close();
  }
}
