import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {ApiResponse} from '../types/api-response';
import {Project, ProjectStatus} from '../types/project';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private readonly ApiService: ApiService, private readonly AuthService: AuthService) {
  }

  async updateResourceWithAuthentification(endpoint: string, data: any): Promise<any> {
    const token = this.AuthService.getToken();
    if (!token) {
      throw new Error('User is not authenticated');
    }

    const apiUrl = this.ApiService.getBaseUrl() + endpoint;

    try {
      const response = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      return response.json();
    } catch (error) {
      console.error('Error updating resource:', error);
      throw error;
    }
  }

  async updateArbeitszeit(userID: number, arbeitszeit: number) {
    let response: ApiResponse<number>
    if (!userID || !arbeitszeit) {
      throw new Error('Invalid userId und Arbeitszeit')
    }
    let data = {userID, arbeitszeit}
    try {
      response = await this.updateResourceWithAuthentification('/api/users/update/arbeitszeit', data);
    } catch (error) {
      throw error;
    }
    if (!response.data) {
      throw new Error('No response received from the server');
    }

    return response.data;
  }

  async updateUrlaubstage(userID: number, urlaubstage: number) {
    let response: ApiResponse<number>
    if (!userID || !urlaubstage) {
      throw new Error('Invalid userId und Urlaubstage')
    }
    try {
      let data = {userID, urlaubstage}
      response = await this.updateResourceWithAuthentification('/api/users/update/urlaubstage', data);
    } catch (error) {
      throw error;
    }
    if (!response.data) {
      throw new Error('No response received from the server');
    }

    return response.data;
  }

  async updateProjectStatus(projectStatus: ProjectStatus, projectId: number): Promise<Project> {
    if (!projectId || projectStatus == null) {
      throw new Error('Invalid project status or projectId');
    }

    try {
      const data = {projectId, projectStatus};
      const response = await this.updateResourceWithAuthentification('/api/project/status/update', data);

      if (!response?.data) {
        throw new Error('Unexpected server response: Missing data');
      }

      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
