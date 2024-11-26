import {Component, OnInit} from '@angular/core';
import {TeamRoadmapComponent} from '../team-roadmap/team-roadmap.component';
import {Roadmap} from '../../../types/roadmap';
import {Team} from '../../../types/team';
import {TeamService} from '../../../services/team.service';
import {UserService} from '../../../services/user.service';
import {NgForOf, NgIf} from '@angular/common';
import {UserRole} from '../../../types/user';
import {SnackbarService} from '../../../services/snackbar.service';
import {slideIn} from '../../../animations/slideIn';

@Component({
  selector: 'app-my-team-roadmap',
  standalone: true,
  imports: [TeamRoadmapComponent, NgIf, NgForOf],
  templateUrl: './my-team-roadmap.component.html',
  styleUrls: ['./my-team-roadmap.component.scss'],
  animations: [
    slideIn
  ],
})
export class MyTeamRoadmapComponent implements OnInit {
  currentTeam?: Team;
  roadmap?: Roadmap;
  roadmaps: Roadmap[] = [];
  teams: Team[] = [];
  firstTeam?: Team;
  isPo: boolean = false;
  isScrum: boolean = false;
  isDev: boolean = false

  constructor(
    private readonly TeamService: TeamService,
    private readonly UserService: UserService,
    private readonly SnackBarService: SnackbarService
  ) {
  }

  async ngOnInit() {
    const user = await this.UserService.getCurrentUser();

    if (!user) {
      console.error('User is not logged in or not found');
      return;
    }

    // Get all teams the user is part of
    try {
      this.teams = await this.TeamService.getTeamsByUserId(user.id);
    }catch (error){
      this.SnackBarService.open('Konnte die Teams nicht abrufen');
    }
    if (this.teams.length === 0) {
      console.error('User is not part of any team');
      return;
    }

    this.firstTeam = this.teams[0];
    if (this.teams.length === 1) {
      await this.fetchRoadmapForTeam(this.firstTeam.id);
    } else {
      await this.fetchRoadmapsForTeams(this.teams)
    }
    if (user && user.role === UserRole.PO) {
      this.isPo = true;
    }
    if (user && user.role === UserRole.SM) {
      this.isScrum = true;
    }
    if (user && user.role === UserRole.Developer) {
      this.isDev = true;
    }
  }

  public async refetch() {
    try {
      if (this.firstTeam)
        await this.fetchRoadmapForTeam(this.firstTeam.id);
    } catch (error) {
      this.SnackBarService.open('Es gab ein Fehler bei der Teamaktualisierung')
    }
  }


  private async fetchRoadmapForTeam(teamId: number) {
    try {
      this.currentTeam = await this.TeamService.getTeamById(teamId);
    }catch (error){
      this.SnackBarService.open('Konnte das Team nicht laden')
    }
    this.roadmap = this.currentTeam?.roadmap;
  }

  private async fetchRoadmapsForTeams(teams: Team[]) {
    try {
      for (const team of teams) {
        const teamDetails = await this.TeamService.getTeamById(team.id);
        if (teamDetails && teamDetails.roadmap) {
          this.roadmaps.push(teamDetails.roadmap);
        }
      }
    } catch (error) {
      this.SnackBarService.open('Es gab ein Fehler bei der Teamaktualisierung')
    }
  }
}
