import {Component, Inject, Input} from '@angular/core';
import {
  MAT_DIALOG_DATA, MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {NgForOf, NgIf} from '@angular/common';
import {TeamService} from '../../../../services/team.service';
import {Team} from '../../../../types/team';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef, MatHeaderRow,
  MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {AddMemberComponent} from '../components/add-member/add-member.component';
import {User} from '../../../../types/user';

@Component({
  selector: 'app-edit-teams',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatDialogActions,
    MatButton,
    MatInput,
    NgForOf,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderRowDef,
    MatHeaderRow,
    MatRowDef,
    MatRow,
    NgIf
  ],
  templateUrl: './edit-teams.component.html',
  styleUrl: './edit-teams.component.scss'
})
export class EditTeamsComponent {
  displayedColumns: string[] = ['Name', 'AnzahlTeammitglieder', 'edit'];
  @Input() teams: Team[] = [];
  @Input() user: User[] = [];

  constructor(public dialog: MatDialog,private readonly TeamService: TeamService) {
    this.teams.forEach(team => {
      if (!team.members) {
        team.members = [];
      }
    });
  }

  openMemberDialog(team: Team,user: User[]) {
    const dialogRef = this.dialog.open(AddMemberComponent, {
      data: { team, user },
    });

    dialogRef.componentInstance.memberRefreshed.subscribe(() => {
      this.reloadTeamData();
    });
  }

  async reloadTeamData() {
    this.teams = await this.TeamService.getTeams();
  }
}
