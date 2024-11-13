import {Component, Inject, OnInit} from '@angular/core';
import {SkillOverviewComponent} from '../skill-overview/skill-overview.component';
import {User, UserRole} from '../../../../../types/user';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {NgForOf, NgIf} from '@angular/common';
import {Team} from '../../../../../types/team';
import {TeamService} from '../../../../../services/team.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-user-details-modal',
  standalone: true,
  imports: [
    SkillOverviewComponent,
    NgForOf,
    FormsModule,
    NgIf,
  ],
  templateUrl: './user-details-modal.component.html',
  styleUrl: './user-details-modal.component.scss'
})
export class UserDetailsModalComponent implements OnInit{

  teams: Team[]=[];
  arbeitszeit?: number;
  currentUser?: User;

  constructor(@Inject(MAT_DIALOG_DATA) public user: User,
              private readonly dialogRef: MatDialogRef<UserDetailsModalComponent>,private readonly TeamService:TeamService) {
    console.log("Nutzerobjekt",user)
  }

  async ngOnInit(){
    if(this.user)
      this.teams = await this.TeamService.getTeamByUserID(this.user.id)
  }

  closeModal() {
    this.dialogRef.close();
  }

    protected readonly UserRole = UserRole;
}
