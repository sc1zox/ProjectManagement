import {Component, OnInit} from '@angular/core';
import {UserTableComponent} from './user-table/user-table.component';
import {User} from '../../../types/user';
import {UserService} from '../../../services/user.service';
import {TeamService} from '../../../services/team.service';
import {EditTeamsComponent} from './edit-teams/edit-teams.component';
import {Team} from '../../../types/team';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [
    UserTableComponent,
    EditTeamsComponent
  ],
  templateUrl: './team-overview.component.html',
  styleUrl: './team-overview.component.scss'
})
export class TeamOverviewComponent implements OnInit {
  user: User[] = [];
  teams: Team[] = [];

  constructor(private readonly UserService: UserService, private readonly TeamService: TeamService) {

  }

  async ngOnInit() {
    this.user = await this.UserService.getUsers();
    this.teams = await this.TeamService.getTeams();
  }


}
