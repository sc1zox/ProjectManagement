import {Component, OnInit} from '@angular/core';
import {TeamRoadmapComponent} from '../team-roadmap/team-roadmap.component';
import {Roadmap} from '../../../types/roadmap';
import {Team} from '../../../types/team';
import {TeamService} from '../../../services/team.service';
import {UserService} from '../../../services/user.service';
import {NgForOf, NgIf} from '@angular/common';
import {UserRole} from '../../../types/user';

@Component({
  selector: 'app-my-team-roadmap',
  standalone: true,
  imports: [TeamRoadmapComponent, NgIf, NgForOf],
  templateUrl: './my-team-roadmap.component.html',
  styleUrls: ['./my-team-roadmap.component.scss'],
})
export class MyTeamRoadmapComponent implements OnInit {
  currentTeam?: Team;
  roadmap?: Roadmap;
  roadmaps: Roadmap[] = [];
  teams: Team[] = [];
  firstTeam?: Team;
  isPo: boolean = false;
  isScrum: boolean = false;

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

    this.firstTeam = this.teams[0];
    if(this.teams.length===1) {
      await this.fetchRoadmapForTeam(this.firstTeam.id);
    }else{
      await this.fetchRoadmapsForTeams(this.teams)
    }
    if(user && user.role === UserRole.PO){
      this.isPo = true;
    }
    if(user && user.role === UserRole.SM){
      this.isScrum = true;
    }
  }

  public async refetch() {
    try {
      if(this.firstTeam)
      await this.fetchRoadmapForTeam(this.firstTeam.id);
    } catch (error) {
      console.error('Error refetching roadmap:', error);
    }
  }


  private async fetchRoadmapForTeam(teamId: number) {
    this.currentTeam = await this.TeamService.getTeamByID(teamId);
    this.roadmap = this.currentTeam?.roadmap;
  }
  private async fetchRoadmapsForTeams(teams: Team[]) {
    try {
      for (const team of teams) {
        const teamDetails = await this.TeamService.getTeamByID(team.id);
        console.log("---------------",teamDetails)
        if (teamDetails && teamDetails.roadmap) {
          this.roadmaps.push(teamDetails.roadmap);
        }
      }
    } catch (error) {
      console.error('Error fetching roadmaps for teams:', error);
    }
  }
}
