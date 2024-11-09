import {Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {Router, RouterLink} from '@angular/router';
import {MatError, MatFormField, MatHint, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {TeamService} from '../../../../services/team.service';
import {Team} from '../../../../types/team';
import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {User, UserRole} from '../../../../types/user';
import {UserService} from '../../../../services/user.service';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {SnackbarService} from '../../../../services/snackbar.service';
import {ApiService} from '../../../../services/api.service';

@Component({
  selector: 'app-mitarbeiter-form',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    RouterLink,
    MatFormField,
    MatLabel,
    MatInput,
    MatHint,
    CdkTextareaAutosize,
    MatSelect,
    MatOption,
    FormsModule,
    NgForOf,
    MatButton,
    ReactiveFormsModule,
    NgIf,
    MatError,
  ],
  templateUrl: './mitarbeiter-form.component.html',
  styleUrl: './mitarbeiter-form.component.scss'
})
export class MitarbeiterFormComponent implements OnInit {

  Teams: Team[] = [];
  user: User = {
    id: 0,
    vorname: '',
    nachname: '',
    password: '',
    role: UserRole.Admin,
    arbeitszeit: 0,
    team: [],
  };
  userRoles = Object.values(UserRole).filter(role => role !== UserRole.Admin);

  form: FormGroup;

  constructor(private fb: FormBuilder, private TeamService: TeamService, private UserService: UserService, private dialog: MatDialog, private router: Router,private SnackBarService: SnackbarService,private ApiSerivce: ApiService) {
    this.form = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      arbeitszeit: ['', Validators.required],
      role: ['', Validators.required],
      passwort: ['', Validators.required],
      selectedSingleTeam: [''], // For single team selection
      selectedMultipleTeams: [[]] // For multiple team selection
    });
  }

  ngOnInit() {
    this.Teams = this.TeamService.getTeams();

    // Listen to changes regarding the role
    this.form.get('role')?.valueChanges.subscribe((role) => {
      console.log("Role changed:", role);
      this.adjustTeamSelectionValidators(role);
    });
  }

  /**
   * Adjusts form validation for team selection based on the user's role.
   * For Scrum Master: sets `selectedMultipleTeams` control as required.
   * For all others: `selectedSingleTeam` control as required.
   * @param role
   */
  adjustTeamSelectionValidators(role: string) {
    const singleTeamControl = this.form.get('selectedSingleTeam');
    const multipleTeamsControl = this.form.get('selectedMultipleTeams');

    if (role == 'SM') {
      multipleTeamsControl?.setValidators([Validators.required]);
      singleTeamControl?.clearValidators();
      singleTeamControl?.setValue(null);
    } else {
      singleTeamControl?.setValidators([Validators.required]);
      multipleTeamsControl?.clearValidators();
      multipleTeamsControl?.setValue([]);
    }

    singleTeamControl?.updateValueAndValidity();
    multipleTeamsControl?.updateValueAndValidity();
  }

  onSubmit() {
    const formValue = this.form.value;

    if (this.form.valid) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {message: 'Wollen Sie diesen Nutzer wirklich erstellen?'}
      });// Open the dialog

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          this.user.team = formValue.role === 'Scrum Master' ? formValue.selectedMultipleTeams : [formValue.selectedSingleTeam];
          this.user.role = formValue.role;
          this.user.vorname = formValue.vorname;
          this.user.nachname = formValue.nachname;
          this.user.password = formValue.passwort;
          this.user.arbeitszeit = formValue.arbeitszeit;

          try {
            await this.UserService.createUser(this.user);
          }catch (error){
            console.error('Error while creating user:', error);
          }
            finally {
            console.log('User creation process finished.');
          }
          this.router.navigate(['/dashboard/admin-panel']);
        } else {
          this.SnackBarService.open("Sie haben die Nutzererstellung abgebrochen");
          console.log('User cancelled the creation of the user.');
        }
      });
    }
  }
}
