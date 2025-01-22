import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatList, MatListItem } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { NgForOf } from '@angular/common';
import { Team } from '../../../../../types/team';
import { User, UserRole } from '../../../../../types/user';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { TeamService } from '../../../../../services/team.service';
import { SnackbarService } from '../../../../../services/snackbar.service';

@Component({
  selector: 'app-add-member',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatFormField,
    MatLabel,
    MatInput,
    FormsModule,
    MatButton,
    MatList,
    MatListItem,
    MatIcon,
    MatDialogActions,
    MatIconButton,
    NgForOf,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption
  ],
  templateUrl: './add-member.component.html',
  styleUrl: './add-member.component.scss'
})
export class AddMemberComponent implements OnInit {
  newMemberName: string = '';
  options?: string[];
  selectedUser?: User;
  teamRequirementStatus: string = '';
  private optionsCache: string[] = [];
  @Output() memberRefreshed = new EventEmitter<void>();
  @Output() memberAdded = new EventEmitter<User>();
  @Output() memberRemoved = new EventEmitter<number>();

  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team, user: User[] },
    private readonly TeamService: TeamService,
    private cdr: ChangeDetectorRef,
    private readonly SnackbarService: SnackbarService
  ) {
  }

  async ngOnInit() {

    this.options = this.data.user
      .filter(member => member.teams!.length === 0 || member.role === UserRole.SM)
      .map(member => member.vorname + ' ' + member.nachname);

    this.updateTeamRequirementStatus();
  }

  async addMember(): Promise<void> {
    this.selectedUser = this.data.user.find(
      (user) => user.vorname + ' ' + user.nachname === this.newMemberName
    );
    if (!this.selectedUser) {
      this.SnackbarService.open('User was not found!');
      return;
    }
  
    if (this.data.team.members) {
      const alreadyInTeam = this.data.team.members.some(
        (member) => member.id === this.selectedUser!.id
      );
  
      if (alreadyInTeam) {
        this.SnackbarService.open('User is already in the team!');
        return;
      }
    }
  
    if (this.selectedUser.teams!.length > 0 && this.selectedUser.role !== UserRole.SM) {
      this.SnackbarService.open('User is already in a team!');
      return;
    }
  
    if (this.selectedUser) {
      try {
        await this.TeamService.addUserToTeam(this.selectedUser.id, this.data.team.id);
        if (this.data.team.members) {
          this.data.team.members.push(this.selectedUser);
          this.memberAdded.emit(this.selectedUser);
          this.updateOptionsList();
          this.updateTeamRequirementStatus();
        }
        this.newMemberName = '';
        this.cdr.detectChanges();
      } catch (error) {
        this.SnackbarService.open('Could not add user to the team');
      }
    }
  }  

  async removeMember(userID: number): Promise<void> {
    try {
      await this.TeamService.removeUserFromTeam(userID, this.data.team.id);

      const updatedTeam = await this.TeamService.getTeamById(this.data.team.id);

      this.data.team = updatedTeam;

      const removedUser = this.data.user.find((user) => user.id === userID);
      if (removedUser && removedUser.teams) {
        removedUser.teams = removedUser.teams.filter((team) => team.id !== this.data.team.id);
      }

      this.memberRemoved.emit(userID);
      this.updateOptionsList();
      this.updateTeamRequirementStatus();
      this.cdr.detectChanges();
    } catch (error) {
      this.SnackbarService.open('Could not remove user from the team')
    }   
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  updateOptionsList(): void { 
    const teamMembers = this.data.team.members ?? [];
    this.options = this.data.user
      .filter(
        (member) =>
          !teamMembers.some((teamMember) => teamMember.id === member.id) &&
          (member.teams?.length === 0 || member.role === UserRole.SM)
      )
      .map((member) => member.vorname + ' ' + member.nachname);
  }
  
  
  updateTeamRequirementStatus(): void {
    const members = this.data.team.members || [];
    const missingRoles: string[] = [];
  
    // Check for each role
    if (!members.some((member) => member.role === UserRole.SM)) {
      missingRoles.push('Scrum Master');
    }
    if (!members.some((member) => member.role === UserRole.PO)) {
      missingRoles.push('Product Owner');
    }
    if (!members.some((member) => member.role === UserRole.Developer)) {
      missingRoles.push('Developer');
    }
  
    // Construct the status message based on missing roles
    if (missingRoles.length > 0) {
      this.teamRequirementStatus = `Missing ${missingRoles.join(', ')}`;
    } else {
      this.teamRequirementStatus = 'Team: Valid';
    }
  }
}
