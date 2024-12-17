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
import {RoadmapService} from '../../../services/roadmap.service';
import {SpinnerComponent} from "../../components/spinner/spinner.component";
import {SpinnerService} from '../../../services/spinner.service';

@Component({
  selector: 'app-my-team-roadmap',
  standalone: true,
    imports: [TeamRoadmapComponent, NgIf, NgForOf, SpinnerComponent],
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
  userTeams: Team[] = [];
  firstTeam?: Team;
  isPo: boolean = false;
  isScrum: boolean = false;
  isDev: boolean = false
  errorMessageNoTeams: string = "";

  constructor(
    private readonly TeamService: TeamService,
    private readonly UserService: UserService,
    private readonly SnackBarService: SnackbarService,
    private readonly RoadmapService: RoadmapService,
    private readonly SpinnerService: SpinnerService,
  ) {
  }

  async ngOnInit() {
    const user = await this.UserService.getCurrentUser();
    this.SpinnerService.show();

    if (!user) {
      console.error('User is not logged in or not found');
      return;
    }

    // Get all teams the user is part of
    try {
      this.userTeams = await this.TeamService.getTeamsByUserId(user.id);
    }catch (error){
      this.SnackBarService.open('Konnte die Teams nicht abrufen');
    }finally {
      this.SpinnerService.hide();
    }
    if (this.userTeams.length === 0) {
      console.error('User is not part of any team');
      this.errorMessageNoTeams = "Fehler! Dieser Nutzer gehört keinem Team an";
      return;
    }

    this.firstTeam = this.userTeams[0];
    if (this.userTeams.length === 1) {
      await this.fetchRoadmapForTeam(this.firstTeam.id);
    } else {
      await this.fetchRoadmapsForTeams(this.userTeams)
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
    let roadmaps;
    try {
      this.currentTeam = await this.TeamService.getTeamById(teamId);
      roadmaps = await this.RoadmapService.getRoadmaps()
    }catch (error){
      this.SnackBarService.open('Konnte das Team nicht laden')
    }
    let roadmapTmp = roadmaps?.filter(roadmap => roadmap?.teams?.id === this.currentTeam?.id)
    if(roadmapTmp)
    this.roadmap = roadmapTmp[0];
  }

  private async fetchRoadmapsForTeams(userTeams: Team[]) {
    try {
      this.roadmaps = await this.RoadmapService.getRoadmaps();
      this.roadmaps = this.roadmaps.filter(roadmap =>
        roadmap.teams && userTeams.some(userTeam => userTeam.id === roadmap.teams!.id)
      );
    } catch (error) {
      this.SnackBarService.open('Es gab ein Fehler bei der Teamaktualisierung')
    }
  }
}
