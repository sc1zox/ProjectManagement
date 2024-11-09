import {Injectable} from '@angular/core';
import {Team} from '../types/team';
import {Project} from '../types/project';
import {ApiService} from './api.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private ApiService: ApiService) {
  }

  projects: Project[] = [];

  private projectCreatedSource = new Subject<void>();
  projectCreated$ = this.projectCreatedSource.asObservable();

  async getProjects(): Promise<Project[]> {
    const response = await this.ApiService.fetch("/projects");
    console.log("Project Fetch "+ response.data)
    if (response.code !== 200) {
      throw new Error('Network response was not ok');
    }
    return <Project[]>response.data
  }

  async getProjectsById(ID: number): Promise<Project> {

    const response = await this.ApiService.fetch(`/projects/${ID}`);

    if (response.code !== 200) {
      throw new Error('Failed to fetch user data for specific id:' + ID);
    }

    return <Project>response.data;
  }


  async setProjects(Project: Project): Promise<Project> {
    const response = await this.ApiService.post("/project/create", Project);
    if (response.code !== 201) {
      throw new Error('Failed to create user');
    }
    return <Project>response.data;
  }
}
