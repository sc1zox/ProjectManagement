import { Injectable } from '@angular/core';
import { User, UserRole } from '../types/user';
import { Team } from '../types/team';
import { Project } from '../types/project';
import {TeamService} from './team.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  exampleTeam: Team[] = []

  constructor(private TeamService: TeamService) {
    this.exampleTeam= this.TeamService.getTeams();
    this.initializeProjects();
  }

  exampleUser: User = {
    role: UserRole.Developer,
    id: 1,
    vorname: 'dev1',
    nachname: 'devus',
    skills: ['JavaScript', 'Angular'],
    token: undefined
  };

  projects: Project[] = [];

  initializeProjects() {
    this.projects = [
      {
        id: 1,
        name: 'Projekt A',
        description: 'Wi projekt1',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        developers: [this.exampleUser],
        team: this.exampleTeam[0],
        backlogItemsDone: 50,
        backlogItemsTotal: 100,
        estimationDays: 5,
        effortEstimation: 'Medium',
      },
      {
        id: 2,
        name: 'Projekt B',
        description: 'Wi.projekt2',
        startDate: new Date('2023-02-01'),
        endDate: new Date('2023-12-31'),
        developers: [this.exampleUser],
        team: this.exampleTeam[1],
        backlogItemsDone: 100,
        backlogItemsTotal: 1000,
        estimationDays: 10,
        effortEstimation: 'Ultra',
      },
      {
        id: 4,
        name: 'Projekt C',
        description: 'Wi.projekt3',
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-12-31'),
        developers: [this.exampleUser],
        team: this.exampleTeam[2],
        backlogItemsDone: 500,
        backlogItemsTotal: 5000,
        estimationDays: 15,
        effortEstimation: 'Low',
      }
    ];
  }

  getProjects(): Project[] {
    return this.projects;
  }
}
