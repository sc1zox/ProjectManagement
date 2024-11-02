import {Injectable} from '@angular/core';
import {User, UserRole} from '../types/user';
import {Team} from '../types/team';
import {Roadmap} from '../types/roadmap';
import {Project} from '../types/project';
import {ProjectService} from './project.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  projects: Project[] = [];

  user: User;
  user2: User;
  user3: User;
  user4: User;
  team?: Team;
  roadmap: Roadmap;
  Users: User[] = [];

  constructor(private ProjectService: ProjectService) {
    this.projects = this.ProjectService.getProjects();
    this.roadmap = this.createRoadmap();
    this.user = this.createUserTest(1, 'Max','Mustermann', UserRole.Admin, ['JavaScript', 'Angular']);
    this.user2 = this.createUserTest(2, 'Hans','Müller', UserRole.SM, ['JavaScript', 'Angular']);
    this.user3 = this.createUserTest(3, 'Claudia','Becker', UserRole.PO, ['JavaScript', 'Angular']);
    this.user4 = this.createUserTest(4, 'Peter','Schmidt', UserRole.Developer, ['JavaScript', 'Angular']);
    this.team = this.createTeam(1, 'Team 1', [this.user, this.user2, this.user3, this.user4]);
    this.Users.push(this.user,
      this.user2,
      this.user3,
      this.user4)


    this.user.team = [this.team];
    this.user2.team = [this.team];
    this.user3.team = [this.team];
    this.user4.team = [this.team];
  }

  createUserTest(id: number, vorname: string,nachname:string, role: UserRole, skills: string[]): User {
    return {
      id,
      vorname,
      nachname,
      skills,
      role,
      token: undefined
    };
  }

  createTeam(id: number, name: string, members: User[]): Team {
    return {
      id,
      name,
      members,
      roadmap: this.roadmap
    };
  }


  createRoadmap(): Roadmap {
    return {
      projekte: this.projects
    };
  }


  // this is later the api fetch now its just using testdata
  getUser(id: number): User {
    return <User>this.Users.find(user => user.id === id); // hier sollte man die id mitübergeben und dann am backend anfragen. Oder man holt alle user und sucht hier im array danach.
  }

  getUsers(): User[] {
    return this.Users;
  }

  getUserTeam(): Team[] | undefined {
    return this.user.team;
  }
  getUserProjects(id: number): Project[] {
    if (this.user && this.user.team) {
      if (this.user.role !== 'Scrum Master') {

        return this.user.team[0]?.roadmap?.projekte || [];
      } else {

        return this.user.team
          .flatMap(team => team.roadmap ? team.roadmap.projekte : []);
      }
    }
    return []; // Default empty array if user or team is not defined
  }

  // this should send data to the backend then
  createUser(User: User) {
    this.Users.push(User);
    console.log('Ersteller User:', User);
  }
}
