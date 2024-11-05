import {Injectable} from '@angular/core';
import {Team} from '../types/team';
import {Project} from '../types/project';
import {ApiService} from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private ApiService: ApiService) {
  }


  projects: Project[] = [];


  async getProjects(): Promise<Project[]> {
    const response = await this.ApiService.fetch("/projects");
    console.log("Project Fetch "+ response.data)
    if (response.code !== 200) {
      throw new Error('Network response was not ok');
    }
    return <Project[]>response.data
  }

  // Projekte für das jeweilige Team holen und an die roadmap geben.
  getProjectsWithTeam(Team: Team): Project[] {
    if (Team.projects) {
      return Team.projects;
    } else {
      return this.projects;
    }
  }

  async setProjects(Project: Project): Promise<Project> {
    const response = await this.ApiService.post("/projects", Project);
    if (response.code !== 201) {
      throw new Error('Failed to create user');
    }

    return <Project>response.data;
  }

}
