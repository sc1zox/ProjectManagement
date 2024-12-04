import {Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {MatList, MatListItem} from '@angular/material/list';
import {NgForOf} from '@angular/common';
import {Team} from '../../../../types/team';
import {TeamService} from '../../../../services/team.service';
import {SnackbarService} from '../../../../services/snackbar.service';

@Component({
  selector: 'app-team-delete',
  standalone: true,
  imports: [
    MatIcon,
    MatIconButton,
    RouterLink,
    MatList,
    MatListItem,
    NgForOf
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
    }catch (error){
      this.SnackBarService.open('Konnte Teams nicht laden')
    }
  }

  async deleteTeam(teamId: number) {
    try{
      await this.TeamService.deleteTeam(teamId);
      this.SnackBarService.open('Team wurde erfolgreich gelöscht');
      this.teams = await this.TeamService.getTeams();
    }catch (error){
      this.SnackBarService.open('Team konnte nicht gelöscht werden');
    }
  }

}
