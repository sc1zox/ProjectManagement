import {Component, OnInit} from '@angular/core';
import {UserTableComponent} from './user-table/user-table.component';
import {User} from '../../../types/user';
import {UserService} from '../../../services/user.service';
import {TeamService} from '../../../services/team.service';
import {EditTeamsComponent} from './edit-teams/edit-teams.component';
import {Team} from '../../../types/team';
import {NgIf} from '@angular/common';
import {SnackbarService} from '../../../services/snackbar.service';
import {fadeIn} from '../../../animations/fadeIn';
import {SpinnerService} from '../../../services/spinner.service';
import {SpinnerComponent} from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [
    UserTableComponent,
    EditTeamsComponent,
    NgIf,
    SpinnerComponent
  ],
  animations: [
    fadeIn,
  ],
  templateUrl: './team-overview.component.html',
  styleUrl: './team-overview.component.scss'
})
export class TeamOverviewComponent implements OnInit {
  users: User[] = [];
  teams: Team[] = [];
  currentUser?: User;
  isScrum: boolean = false;

  constructor(private readonly UserService: UserService, private readonly TeamService: TeamService,private readonly SnackBarService: SnackbarService, private SpinnerService: SpinnerService) {

  }

  async ngOnInit() {
    this.SpinnerService.show();
    try {
      this.users = await this.UserService.getUsers();
      this.teams = await this.TeamService.getTeams();
      this.currentUser = await this.UserService.getCurrentUser();
    }catch (error){
      this.SnackBarService.open('Es gab ein Fehler bei der Initalisierung')
    }finally {
      this.SpinnerService.hide();
    }

    this.isScrum = this.currentUser?.role === 'SM';
  }


}
