import {ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatList, MatListItem} from '@angular/material/list';
import {MatIcon} from '@angular/material/icon';
import {NgForOf} from '@angular/common';
import {Team} from '../../../../../types/team';
import {User, UserRole} from '../../../../../types/user';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {TeamService} from '../../../../../services/team.service';
import {SnackbarService} from '../../../../../services/snackbar.service';

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
  @Output() memberRefreshed = new EventEmitter<void>();

  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team,user: User[] },
    private readonly TeamService: TeamService,
    private cdr: ChangeDetectorRef,
    private readonly SnackbarService: SnackbarService
  ) {
  }

  async ngOnInit() {
    console.log(this.data.user)

    this.options = this.data.user
      .filter(member => member.teams!.length === 0 || member.role === UserRole.SM)
      .map(member => member.vorname + ' ' + member.nachname);
  }

  async addMember(): Promise<void> {
    this.selectedUser = this.data.user.find(
      (user) => user.vorname + ' ' + user.nachname === this.newMemberName
    );
    if(!this.selectedUser){
      this.SnackbarService.open('Benutzer wurde nicht gefunden!');
      return;
    }
    if (this.data.team.members) {
      const alreadyInTeam = this.data.team.members.some(
        (member) => member.id === this.selectedUser!.id
      );

      if (alreadyInTeam) {
        this.SnackbarService.open('Benutzer ist bereits im Team!');
        return;
      }
    }
    if(this.selectedUser.teams!.length > 0 || this.selectedUser.role === UserRole.SM){
      this.SnackbarService.open('Benutzer ist bereits in einem Team!');
      return;
    }
    if (this.selectedUser) {
      await this.TeamService.addUserToTeam(this.selectedUser.id, this.data.team.id);
      if (this.data.team.members)
        this.data.team.members.push(this.selectedUser);
      this.newMemberName = '';
      this.cdr.detectChanges();
    }
  }

  async removeMember(userID: number): Promise<void> {
    await this.TeamService.removeUserFromTeam(userID, this.data.team.id);
    if (this.data.team.members)
      this.data.team.members = this.data.team.members.filter((member) => member.id !== userID);
    this.cdr.detectChanges();
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
