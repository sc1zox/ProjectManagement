import {Component, Inject, OnInit} from '@angular/core';
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
import {User} from '../../../../../types/user';
import {MatAutocomplete, MatAutocompleteTrigger, MatOption} from '@angular/material/autocomplete';
import {UserService} from '../../../../../services/user.service';

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
export class AddMemberComponent implements OnInit{
  newMemberName: string = '';
  options?: string[];

  constructor(
    public dialogRef: MatDialogRef<AddMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { team: Team },
    private readonly UserService:UserService,
  ) {}

  async ngOnInit() {
    let users: User[] = await this.UserService.getUsers();
    this.options = users.map(member => member.vorname + ' ' + member.nachname)
  }

  addMember(): void {
  }

  removeMember(member: User): void {

  }

  onSave(): void {
    this.dialogRef.close(this.data.team.members);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
