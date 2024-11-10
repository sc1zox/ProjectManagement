import {Component, OnInit} from '@angular/core';
import {TeamRoadmapComponent} from '../team-roadmap/team-roadmap.component';
import {Roadmap} from '../../../types/roadmap';
import {Team} from '../../../types/team';
import {TeamService} from '../../../services/team.service';
import {UserService} from '../../../services/user.service';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-my-team-roadmap',
  standalone: true,
  imports: [TeamRoadmapComponent, NgIf],
  templateUrl: './my-team-roadmap.component.html',
  styleUrls: ['./my-team-roadmap.component.scss'],
})
export class MyTeamRoadmapComponent implements OnInit {
  currentTeam?: Team;
  roadmap?: Roadmap;
  teams: Team[] = [];

  constructor(
    private readonly TeamService: TeamService,
    private readonly UserService: UserService
  ) {}

  async ngOnInit() {
    const user = await this.UserService.getCurrentUser();

    if (!user) {
      console.error('User is not logged in or not found');
      return;
    }

    // Get all teams the user is part of
    this.teams = await this.TeamService.getTeamByUserID(user.id);

    if (this.teams.length === 0) {
      console.error('User is not part of any team');
      return;
    }

    const firstTeam = this.teams[0];
    await this.fetchRoadmapForTeam(firstTeam.id);
  }

  private async fetchRoadmapForTeam(teamId: number) {
    this.currentTeam = await this.TeamService.getTeamByID(teamId);
    this.roadmap = this.currentTeam?.roadmap;
  }
}
