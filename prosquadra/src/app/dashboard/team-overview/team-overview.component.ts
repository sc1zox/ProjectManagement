import {Component, OnInit} from '@angular/core';
import {UserTableComponent} from './user-table/user-table.component';
import {User} from '../../../types/user';
import {UserService} from '../../../services/user.service';
import {TeamService} from '../../../services/team.service';
import {EditTeamsComponent} from './edit-teams/edit-teams.component';
import {Team} from '../../../types/team';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [
    UserTableComponent,
    EditTeamsComponent,
    NgIf
  ],
  templateUrl: './team-overview.component.html',
  styleUrl: './team-overview.component.scss'
})
export class TeamOverviewComponent implements OnInit {
  users: User[] = [];
  teams: Team[] = [];
  currentUser?: User;
  isScrum: boolean = false;

  constructor(private readonly UserService: UserService, private readonly TeamService: TeamService) {

  }

  async ngOnInit() {
    this.users = await this.UserService.getUsers();
    this.teams = await this.TeamService.getTeams();
    this.currentUser = await this.UserService.getCurrentUser();

    this.isScrum = this.currentUser?.role === 'SM';
  }


}
