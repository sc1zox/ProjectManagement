import {Injectable, OnInit} from '@angular/core';
import {Project, ProjectStatus} from '../types/project';
import {ApiService} from './api.service';
import {ApiResponse} from '../types/api-response';
import {Estimation} from '../types/estimation';

@Injectable({
  providedIn: 'root'
})
export class ProjectService implements OnInit {

  projects: Project[] = [];

  constructor(private readonly ApiService: ApiService) {
  }

  async ngOnInit() {
    this.projects = await this.getProjects();
  }

  async getProjects(): Promise<Project[]> {
    try {
      const response: ApiResponse<Project[]> = await this.ApiService.fetch("/projects");
      return response.data
    } catch (error) {
      throw error;
    }
  }

  async getProjectsById(ID: number): Promise<Project> {
    try {
      const response: ApiResponse<Project> = await this.ApiService.fetch('/projects/' + ID);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProjectsByTeamId(ID: number): Promise<Project[]> {
    try {
      const response: ApiResponse<Project[]> = await this.ApiService.fetch('/team/projects/' + ID);
      return response.data
    } catch (error) {
      throw error;
    }
  }


  async setProjects(Project: Project): Promise<Project> {
    try {
      const response: ApiResponse<Project> = await this.ApiService.post("/project/create", Project);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateProject(payload: Partial<Project>) {

    try {
      const response = await this.ApiService.put('/project/update', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getProjectWithLowestPriorityByUserId(ID: number): Promise<Project> {
    try {
      const response: ApiResponse<Project> = await this.ApiService.fetch('/project/current/' + ID);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteProjectById(projectId: number): Promise<void> {
    try {
      const response: ApiResponse<void> = await this.ApiService.delete('/project/delete/' + projectId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateEstimation(estimation: number, userId: number, projectId: number): Promise<Estimation> {
    const sendToApi = {
      projectId: projectId,
      estimationHours: estimation,
      userId: userId,
    };
    try {
      const response: ApiResponse<Estimation> = await this.ApiService.post("/project/create/estimation", sendToApi);
      return response.data;
    } catch (error) {
      throw error
    }
  }

  async getProjectEstimationAvg(projectId: number): Promise<number> {
    let response: ApiResponse<number>;
    try {
      response = await this.ApiService.fetch('/project/estimation/' + projectId);
      return response.data;
    } catch (error) {
    }
    return -1;
  }

  async setProjectStatus(projectId: number, projectStatus: ProjectStatus): Promise<Project> {
    const body = { projectId,projectStatus};
    try {
      const response: ApiResponse<Project> = await this.ApiService.put('/project/status/update', body);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

