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
export class MitarbeiterFormComponent implements OnInit{

  Teams: Team[]=[];
  user: User={
    id:0,
    vorname:'',
    nachname:'',
    team: [],
  };
  userRoles = Object.values(UserRole).filter(role => role !== UserRole.Admin);

  form: FormGroup;

  constructor(private fb: FormBuilder,private TeamService: TeamService,private UserService:UserService,private dialog: MatDialog,private router:Router) {
    this.form = this.fb.group({
      vorname: ['', Validators.required],
      nachname: ['', Validators.required],
      role: ['', Validators.required],
      selectedSingleTeam: [''], // For single team selection
      selectedMultipleTeams: [[]] // For multiple team selection
    });
  }

  ngOnInit() {
    this.Teams = this.TeamService.getTeams();
  }

  onSubmit() {
    const formValue = this.form.value;

    if (this.form.valid) {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        data: { message: 'Wollen Sie diesen Nutzer wirklich erstellen?' }
      });// Open the dialog

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (this.user.id) {
            this.user.id += 1;
          }

          this.user.team = formValue.role === 'Scrum Master' ? formValue.selectedMultipleTeams : [formValue.selectedSingleTeam];
          this.user.role = formValue.role;
          this.user.vorname = formValue.vorname;
          this.user.nachname = formValue.nachname;

          this.UserService.createUser(this.user); // Diese Daten dann an den Server schicken
          this.router.navigate(['/dashboard/admin-panel']);
        } else {
          window.alert("Sie haben die Nutzererstellung abgebrochen")
          console.log('User cancelled the creation of the user.');
        }
      });
    }
  }

}
