import {Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NgForOf} from '@angular/common';
import {Team} from '../../../../types/team';
import {TeamService} from '../../../../services/team.service';
import {SnackbarService} from '../../../../services/snackbar.service';
import {MatCard, MatCardActions, MatCardTitle} from '@angular/material/card';
import {NotificationsService} from '../../../../services/notifications.service';
import {User} from '../../../../types/user';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-team-delete',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    RouterLink,
    NgForOf,
    MatCard,
    MatCardTitle,
    MatCardActions,
    MatButton
  ],
  templateUrl: './team-delete.component.html',
  styleUrl: './team-delete.component.scss'
})
export class TeamDeleteComponent implements OnInit {

  teams: Team[] = [];
  bereichsleiter: User[] = [];
  users: User[] = [];

  constructor(private TeamService: TeamService,
              private readonly SnackBarService: SnackbarService,
              private readonly NotificationService: NotificationsService,
              private readonly UserService: UserService) {
  }

  async ngOnInit() {
    try {
      this.teams = await this.TeamService.getTeams();
      this.users = await this.UserService.getUsers();
      this.bereichsleiter = this.UserService.getBereichsleiter(this.users)
      this.removeInitTeam();
    }catch (error){
      this.SnackBarService.open('Could not load teams')
    }
  }

  async deleteTeam(teamId: number) {
    try{
      let deletedTeam: Team = await this.TeamService.getTeamById(teamId)
      await this.TeamService.deleteTeam(teamId);
      this.SnackBarService.open('Team was successfully deleted');
      for(let b of this.bereichsleiter) {
        await this.NotificationService.createNotification(`The team: ${deletedTeam.name} has been deleted`, b.id)
      }
      this.teams = await this.TeamService.getTeams();
      this.removeInitTeam();
    }catch (error){
      this.SnackBarService.open('Team could not be deleted');
    }
  }
  removeInitTeam(){
    this.teams = this.teams.filter(team => team.id !== 1)
  }
}
