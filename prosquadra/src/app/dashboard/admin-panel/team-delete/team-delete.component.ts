import {Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatList, MatListItem} from '@angular/material/list';
import {NgForOf} from '@angular/common';
import {Team} from '../../../../types/team';
import {TeamService} from '../../../../services/team.service';
import {SnackbarService} from '../../../../services/snackbar.service';
import {MatCard, MatCardActions, MatCardTitle} from '@angular/material/card';

@Component({
  selector: 'app-team-delete',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    RouterLink,
    MatList,
    MatListItem,
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

  constructor(private TeamService: TeamService, private readonly SnackBarService: SnackbarService) {
  }

  async ngOnInit() {
    try {
      this.teams = await this.TeamService.getTeams();
      this.removeInitTeam();
    }catch (error){
      this.SnackBarService.open('Could not load teams')
    }
  }

  async deleteTeam(teamId: number) {
    try{
      await this.TeamService.deleteTeam(teamId);
      this.SnackBarService.open('Team was successfully deleted');
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
