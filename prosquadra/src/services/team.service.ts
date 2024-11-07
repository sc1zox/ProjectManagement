import { Injectable } from '@angular/core';
import { User, UserRole } from '../types/user';
import { Roadmap } from '../types/roadmap';
import { Team } from '../types/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor() {

  }

  // Static data, this needs to be fetched from the server down the line

  exampleUsers: User[] = [
    {
      role: UserRole.Developer,
      id: 1,
      vorname: 'dev1',
      nachname:'devus',
      password: 'test',
      skills: ['JavaScript', 'Angular'],
      token: undefined
    },
    {
      role: UserRole.SM,
      id: 2,
      vorname: 'design1',
      nachname:'devus',
      password: 'test',
      skills: ['Figma', 'Photoshop'],
      token: undefined
    },
    {
      role: UserRole.PO,
      id: 3,
      vorname: 'pm1',
      nachname:'devus',
      password: 'test',
      skills: ['Agile', 'Scrum'],
      token: undefined
    }
  ];



  roadmaps: Roadmap[] = [
    {
      projekte: []
    },
    {
      projekte:[]
    }
  ];

  exampleTeams: Team[] = [
    {
      id: 1,
      name: 'Team Alpha',
      members: [this.exampleUsers[0], this.exampleUsers[1]], // Adding developer and designer
      roadmap: this.roadmaps[0]
    },
    {
      id: 2,
      name: 'Team Beta',
      members: [this.exampleUsers[1], this.exampleUsers[2]], // Adding designer and project manager
      roadmap: this.roadmaps[1]
    },
    {
      id: 3,
      name: 'Team Gamma',
      members: [this.exampleUsers[0], this.exampleUsers[2]], // Adding developer and project manager
      roadmap: this.roadmaps[0]
    }
  ];

  public getTeams(): Team[] {
    return this.exampleTeams;
  }
  public createTeam(team: Team) {
    this.exampleTeams.push(team);
    console.log('Das erstellte Team:', team);
  }
}
