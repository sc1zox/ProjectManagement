import {Component, OnChanges, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router, RouterLink} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatError, MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption, MatSelect} from '@angular/material/select';
import {NgForOf, NgIf} from '@angular/common';
import {User, UserRole} from '../../../../types/user';
import {UserService} from '../../../../services/user.service';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {SnackbarService} from '../../../../services/snackbar.service';
import {TeamService} from '../../../../services/team.service';
import {Team} from '../../../../types/team';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {Login} from '../../../../types/login';
import {NotificationsService} from '../../../../services/notifications.service';


const defaultUrlaubstage: number = 28;
const defaultArbeitszeit: number = 38.5;


@Component({
  selector: 'app-mitarbeiter-form',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatInput,
    MatSelect,
    MatOption,
    FormsModule,
    NgForOf,
    MatButton,
    ReactiveFormsModule,
    NgIf,
    MatError,
    MatStep,
    MatStepper,
    RouterLink,
    MatStepLabel,
    MatStepperNext,
    MatStepperPrevious,
  ],
  templateUrl: './mitarbeiter-form.component.html',
  styleUrl: './mitarbeiter-form.component.scss'
})
export class MitarbeiterFormComponent implements OnInit, OnChanges {

  Team: Team[] = [];
  bereichsLeiter: User[] = [];
  users: User[] = [];
  user: User = {
    id: 0,
    vorname: '',
    nachname: '',
    role: UserRole.Admin,
    arbeitszeit: 0,
    teams: [],
  };
  Login: Login = {
    password: '',
    username: '',
  }
  userRoles = Object.values(UserRole);

  firstFormGroup: FormGroup;
  loginFormGroup: FormGroup;

  constructor(private fb: FormBuilder,
              private TeamService: TeamService,
              private UserService: UserService,
              private dialog: MatDialog,
              private router: Router,
              private SnackBarService: SnackbarService,
              private readonly NotificationService: NotificationsService) {
    this.firstFormGroup = this.fb.group({
      vorname: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      nachname: ['', [Validators.required, Validators.pattern('^[A-Za-z]+$')]],
      arbeitszeit: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      role: ['', Validators.required],
      urlaubstage: [28, [Validators.required, Validators.min(0)]],
      selectedSingleTeam: [''],
      selectedMultipleTeams: [[]]
    });


    this.loginFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async ngOnInit() {
    try {
      this.Team = await this.TeamService.getTeams();
      this.Team = this.Team.filter(team => team.id !== 1);
      this.users = await this.UserService.getUsers();
      this.bereichsLeiter = this.UserService.getBereichsleiter(this.users)
    }catch (error){
      this.SnackBarService.open('Could not load the teams')
    }

    this.firstFormGroup.get('role')?.valueChanges.subscribe((role) => {
      this.adjustTeamSelectionValidators(role);
    });
    this.firstFormGroup.get('arbeitszeit')?.valueChanges.subscribe((arbeitszeit) => {
      this.calculateUrlaubstage(arbeitszeit);
    });
  }

  calculateUrlaubstage(arbeitszeit: number){
    const urlaubstage: number = Math.trunc(defaultUrlaubstage / (defaultArbeitszeit / arbeitszeit));
    this.firstFormGroup.get('urlaubstage')?.setValue(urlaubstage, { emitEvent: false });
  }

  async ngOnChanges() {
    try {
      this.Team = await this.TeamService.getTeams();
      this.Team = this.Team.filter(team => team.id !== 1);
    }catch (error){
      this.SnackBarService.open('Could not load the teams')
    }
  }

  adjustTeamSelectionValidators(role: string) {
    const singleTeamControl = this.firstFormGroup.get('selectedSingleTeam');
    const multipleTeamsControl = this.firstFormGroup.get('selectedMultipleTeams');

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
    const formValueUser = this.firstFormGroup.value;
    const formValueLogin = this.loginFormGroup.value;

    if (this.firstFormGroup.valid) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: {message: 'Do you really want to create this user?'}
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          this.user.teams = formValueUser.role === 'SM' ? formValueUser.selectedMultipleTeams : [formValueUser.selectedSingleTeam];
          this.user.role = formValueUser.role;
          this.user.vorname = formValueUser.vorname;
          this.user.nachname = formValueUser.nachname;
          this.user.arbeitszeit = formValueUser.arbeitszeit;
          if (formValueUser.urlaubstage) {
            this.user.urlaubstage = formValueUser.urlaubstage;
          } else {
            this.user.urlaubstage = 28;
          }
          this.Login.username = formValueLogin.username;
          this.Login.password = formValueLogin.password;

          try {
            let responseUser = await this.UserService.createUser(this.user);
            this.Login.userId = responseUser.id;
            await this.UserService.createLogin(this.Login);
            this.SnackBarService.open('The user creation was successful');
            for(let b of this.bereichsLeiter) {
              await this.NotificationService.createNotification(`A new user has been created: ${this.user.vorname} ${this.user.nachname}`, b.id)
            }
            this.router.navigate(['/dashboard/admin-panel']);
          } catch (error) {
            this.SnackBarService.open('Employee creation has gone wrong');
          }
        } else {
          this.SnackBarService.open("You have cancelled the user creation");
        }
      });
    }
  }
}
