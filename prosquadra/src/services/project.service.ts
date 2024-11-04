import { Injectable } from '@angular/core';
import { User, UserRole } from '../types/user';
import { Team } from '../types/team';
import { Project } from '../types/project';
import { TeamService } from './team.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  exampleTeams: Team[] = []; // Changed from exampleTeam to exampleTeams for clarity

  constructor(private TeamService: TeamService) {
    this.initializeTeams(); // Initialize teams here
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

  exampleUser2: User = {
    role: UserRole.Developer,
    id: 2,
    vorname: 'dev2',
    nachname: 'devette',
    skills: ['Python', 'Django'],
    token: undefined
  };

  projects: Project[] = [];

  initializeTeams() {
    // Define your example teams
    this.exampleTeams = [
      {
        id: 1,
        name: 'Team A',
        members: [this.exampleUser]
      },
      {
        id: 2,
        name: 'Team B',
        members: [this.exampleUser2]
      }

    ];
  }

  initializeProjects() {
    this.projects = [
      {
        id: 1,
        name: 'Projekt A',
        description: 'Wi projekt1',
        startDate: new Date('2023-01-01'),
        endDate: new Date('2023-12-31'),
        developers: [this.exampleUser],
        team: this.exampleTeams[0], // Reference to Team A
        backlogItemsDone: 50,
        backlogItemsTotal: 100,
        estimationDays: 5,
        effortEstimation: 'Medium',
        scrumMaster: this.exampleUser,
        productOwner: this.exampleUser
      },
      {
        id: 2,
        name: 'Projekt B',
        description: 'Wi.projekt2',
        startDate: new Date('2023-02-01'),
        endDate: new Date('2023-12-31'),
        developers: [this.exampleUser],
        team: this.exampleTeams[1], // Reference to Team B
        backlogItemsDone: 100,
        backlogItemsTotal: 1000,
        estimationDays: 10,
        effortEstimation: 'Ultra',
        scrumMaster: this.exampleUser,
        productOwner: this.exampleUser
      },
      {
        id: 3,
        name: 'Projekt C',
        description: 'Wi.projekt3',
        startDate: new Date('2023-03-01'),
        endDate: new Date('2023-12-31'),
        developers: [this.exampleUser],
        team: this.exampleTeams[0], // Reference to Team A
        backlogItemsDone: 500,
        backlogItemsTotal: 5000,
        estimationDays: 15,
        effortEstimation: 'Low',
        scrumMaster: this.exampleUser,
        productOwner: this.exampleUser
      }
    ];
  }

  getProjects(): Project[] {
    return this.projects;
  }

  // Projekte für das jeweilige Team holen und an die roadmap geben.
  getProjectsWithTeam(Team: Team): Project[] {
    if(Team.projects) {
      return Team.projects;
    }else{
      return this.projects;
    }
  }

  setProjects(Project: Project) {
    this.projects.push(Project);
  }
}
