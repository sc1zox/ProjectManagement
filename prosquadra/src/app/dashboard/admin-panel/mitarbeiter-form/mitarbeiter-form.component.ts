import {Component, OnChanges, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {Router, RouterLink} from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatError, MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { NgForOf, NgIf } from '@angular/common';
import { User, UserRole } from '../../../../types/user';
import { UserService } from '../../../../services/user.service';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { SnackbarService } from '../../../../services/snackbar.service';
import {TeamService} from '../../../../services/team.service';
import {Team} from '../../../../types/team';
import {MatStep, MatStepLabel, MatStepper, MatStepperNext, MatStepperPrevious} from '@angular/material/stepper';
import {Login} from '../../../../types/login';

@Component({
  selector: 'app-mitarbeiter-form',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
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
export class MitarbeiterFormComponent implements OnInit,OnChanges {

  Teams: Team[] = [];
  user: User = {
    id: 0,
    vorname: '',
    nachname: '',
    role: UserRole.Admin,
    arbeitszeit: 0,
    team: [],
  };
  Login: Login = {
    password: '',
    username: '',
  }
  userRoles = Object.values(UserRole);

  firstFormGroup: FormGroup;
  loginFormGroup: FormGroup;

  constructor(private fb: FormBuilder, private TeamService: TeamService, private UserService: UserService, private dialog: MatDialog, private router: Router, private SnackBarService: SnackbarService) {
    this.firstFormGroup = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      arbeitszeit: ['', Validators.required],
      role: ['', Validators.required],
      urlaubstage: [''],
      selectedSingleTeam: [''],
      selectedMultipleTeams: [[]]
    });


    this.loginFormGroup = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async ngOnInit() {
    this.Teams = await this.TeamService.getTeams();

    this.firstFormGroup.get('role')?.valueChanges.subscribe((role) => {
      this.adjustTeamSelectionValidators(role);
    });
  }

  async ngOnChanges(){
    this.Teams = await this.TeamService.getTeams();
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
        data: { message: 'Wollen Sie diesen Nutzer wirklich erstellen?' }
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (result) {
          this.user.team = formValueUser.role === 'Scrum Master' ? formValueUser.selectedMultipleTeams : [formValueUser.selectedSingleTeam];
          this.user.role = formValueUser.role;
          this.user.vorname = formValueUser.vorname;
          this.user.nachname = formValueUser.nachname;
          this.user.arbeitszeit = formValueUser.arbeitszeit;
          if(formValueUser.urlaubstage) {
            this.user.urlaubstage = formValueUser.urlaubstage;
          }else{
            this.user.urlaubstage = 0;
          }
          this.Login.username = formValueLogin.username;
          this.Login.password = formValueLogin.password;

          try {
            let responseLogin = await this.UserService.createLogin(this.Login);
            if(responseLogin) {
              let responseUser = await this.UserService.createUser(this.user);
              this.Login.userId = responseUser.id;
            }
          } catch (error) {
            console.error('Error while creating user:', error);
          } finally {
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
