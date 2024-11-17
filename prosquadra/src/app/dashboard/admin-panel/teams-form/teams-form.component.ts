import {Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {Router, RouterLink} from '@angular/router';
import {MatButton, MatIconButton} from '@angular/material/button';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {NgForOf, NgIf} from '@angular/common';
import {TeamService} from '../../../../services/team.service';
import {Team} from '../../../../types/team';
import {UserService} from '../../../../services/user.service';
import {User, UserRole} from '../../../../types/user';
import {ConfirmDialogComponent} from '../mitarbeiter-form/confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../../../services/snackbar.service';
import {NotificationsService} from '../../../../services/notifications.service';

@Component({
  selector: 'app-teams-form',
  standalone: true,
  imports: [
    MatIcon,
    RouterLink,
    MatIconButton,
    FormsModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    NgForOf,
    ReactiveFormsModule,
    MatError,
    NgIf,
  ],
  templateUrl: './teams-form.component.html',
  styleUrl: './teams-form.component.scss'
})
export class TeamsFormComponent implements OnInit {

  Team: Team = {
    id: 1,
    name: '',
    members: [],
  };
  Users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser?: number[];
  selectedUsers: User[] = [];
  teamForm: FormGroup;

  constructor(private TeamService: TeamService, private UserService: UserService, private fb: FormBuilder, private dialog: MatDialog,private router: Router,private SnackBarService: SnackbarService,private readonly NotificationService: NotificationsService) {
    this.teamForm = this.fb.group({
      teamName: ['', Validators.required],
      selectedUser: [[], Validators.required]
    });
  }

  async ngOnInit() {
    try {
      this.Users = await this.UserService.getUsers();
    }catch (error){
      console.error('Error while fetching Users:', error);
    }
    this.filterUsers()
    console.log(this.filteredUsers,this.Users)
  }

  private filterUsers() {
    this.filteredUsers = this.Users.filter(user => {
      return user.role === UserRole.SM || (user.teams && user.teams.length > 0);
    });
  }

  onSubmit() {
    const formValue = this.teamForm.value;

    if (this.teamForm.valid) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { message: 'Wollen Sie dieses Team wirklich anlegen?' }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.selectedUser = formValue.selectedUser;
          if (this.Team) {
            if (this.selectedUser) {
              for (const userId of this.selectedUser) {
                const user = this.Users.find(u => u.id === userId);
                if (user) {
                  this.selectedUsers.push(user);
                }
              }
            }
            this.Team.name = formValue.teamName;
            this.Team.members = this.selectedUsers;
            this.TeamService.createTeam(this.Team);
            this.selectedUser?.forEach((user) => {
              this.NotificationService.createNotification('Du wurdest einem neuen Team hinzugefügt',user)
            })
            this.router.navigate(['/dashboard/admin-panel']);
          }
          // Diese Daten dann an den Server schicken
        } else {
         this.SnackBarService.open("Sie haben die Teamerstellung abgebrochen")
        }
      });
    }
  }
}
