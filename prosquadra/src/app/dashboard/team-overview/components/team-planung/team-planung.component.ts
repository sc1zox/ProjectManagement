import {Component, Input, OnInit} from '@angular/core';
import {User} from '../../../../../types/user';
import {NgForOf} from '@angular/common';
import {TeamService} from '../../../../../services/team.service';
import {Team} from '../../../../../types/team';

@Component({
  selector: 'app-team-planung',
  standalone: true,
  imports: [
    NgForOf
  ],
  templateUrl: './team-planung.component.html',
  styleUrl: './team-planung.component.scss'
})
export class TeamPlanungComponent implements OnInit{
  teams: Team[]=[];
  @Input() user?: User;
  constructor(private readonly TeamService:TeamService) {
  }


  async ngOnInit(){
    if(this.user)
    this.teams = await this.TeamService.getTeamByUserID(this.user.id)
  }
}
