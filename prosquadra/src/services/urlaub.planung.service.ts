import {Injectable} from '@angular/core';
import {Project} from '../types/project';
import {Roadmap} from '../types/roadmap';
import {TeamService} from './team.service';
import {Team} from '../types/team';

@Injectable({
  providedIn: 'root'
})
export class UrlaubPlanungService{

  roadmap?: Roadmap;
  team?: Team[];

  constructor(private TeamService: TeamService) { }

// sm has multiple teams
  async checkIfVacationIsValid(startDatum: Date, endDatum: Date, userId: number): Promise<boolean> {

    const teams = await this.TeamService.getTeamsByUserId(userId);

    for (const team of teams) {
      const projects = team.projects;

      if (projects) {
        for (const project of projects) {
          if (project.startDate && project.endDate) {
            const projectStart = new Date(project.startDate).getTime();
            const projectEnd = new Date(project.endDate).getTime();
            const vacationStart = new Date(startDatum).getTime();
            const vacationEnd = new Date(endDatum).getTime();

            if (
              (vacationStart >= projectStart && vacationStart <= projectEnd) ||
              (vacationEnd >= projectStart && vacationEnd <= projectEnd) ||
              (vacationStart <= projectStart && vacationEnd >= projectEnd)
            ) {
              console.log("Überlappung gefunden!");
              return false;
            }
          }
        }
      }
    }

    return true; // Kein Konflikt gefunden
  }
}

