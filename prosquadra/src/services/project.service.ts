import {Injectable, OnInit} from '@angular/core';
import {Project} from '../types/project';
import {ApiService} from './api.service';
import {Subject} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements OnInit{

  constructor(private readonly ApiService: ApiService,private readonly AuthService: AuthService) {
  }

  projects: Project[] = [];

  async ngOnInit() {
    this.projects = await this.getProjects();
    console.log("proj service:" , this.projects)
  }

  private readonly projectCreatedSource = new Subject<void>();
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

  async updateProject(updatedProject: Project) {
    try {
      await this.updateResource('/api/project/update', updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }


  // Helper function for API calls weil in api service mit token circular dependencies entstanden
  async updateResource(endpoint: string, data: any): Promise<any> {
    const token = this.AuthService.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const apiUrl = this.ApiService.getBaseUrl() + endpoint;

    try {
      await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  }



}
