import {Injectable, OnInit} from '@angular/core';
import {Project} from '../types/project';
import {ApiService} from './api.service';
import {Subject} from 'rxjs';
import {AuthService} from './auth.service';
import {ApiResponse} from '../types/api-response';
import {UpdateService} from './update.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements OnInit{

  constructor(private readonly ApiService: ApiService,private readonly UpdateService: UpdateService) {
  }

  projects: Project[] = [];

  async ngOnInit() {
    this.projects = await this.getProjects();
    console.log("proj service:" , this.projects)
  }

  private readonly projectCreatedSource = new Subject<void>();
  projectCreated$ = this.projectCreatedSource.asObservable();

  async getProjects(): Promise<Project[]> {
    const response:ApiResponse<Project[]> = await this.ApiService.fetch("/projects");
    console.log("Project Fetch "+ response.data)
    if (response.code !== 200) {
      throw new Error('Network response was not ok');
    }
    return response.data
  }

  async getProjectsById(ID: number): Promise<Project> {

    const response: ApiResponse<Project> = await this.ApiService.fetch('/projects/'+ID);

    if (response.code !== 200) {
      throw new Error('Failed to fetch projects for specific id:' + ID);
    }

    return response.data;
  }
  async getProjectsByTeamId(ID: number): Promise<Project[]> {

    const response: ApiResponse<Project[]> = await this.ApiService.fetch('/team/projects/'+ID);

    if (response.code !== 200) {
      throw new Error('Failed to fetch projects for specific Team id:' + ID);
    }

    return response.data;
  }


  async setProjects(Project: Project): Promise<Project> {
    const response = await this.ApiService.post("/project/create", Project);
    if (response.code !== 201) {
      throw new Error('Failed to create user');
    }
    return <Project>response.data;
  }

  async updateProject(updatedProject: Project) {
    try {
      await this.UpdateService.updateResource('/api/project/update', updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }
  async getProjectWithLowestPriorityByUserId(ID: number): Promise<Project>{
    const response: ApiResponse<Project> = await this.ApiService.fetch('/project/current/'+ID);

    if (response.code !== 200) {
      throw new Error('Failed to fetch projects for specific Team id:' + ID);
    }

    return response.data;
  }

}
