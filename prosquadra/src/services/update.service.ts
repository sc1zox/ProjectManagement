import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';
import {ApiResponse} from '../types/api-response';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private readonly ApiService: ApiService, private readonly AuthService: AuthService) {
  }

  async updateResource(endpoint: string, data: any): Promise<any> {
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

    if (!userID || !arbeitszeit) {
      throw new Error('Invalid userId und Arbeitszeit')
    }
    let body = {userID, arbeitszeit}
    const response: ApiResponse<number> = await this.updateResource('/api/users/update/arbeitszeit', body);

    if (!response.data) {
      throw new Error('No response received from the server');
    }

    if (response.code !== 200) {
      throw new Error('Failed to update Arbeitszeit');
    }

    return response.data;
  }

  async updateUrlaubstage(userID: number, urlaubstage: number) {

    if (!userID || !urlaubstage) {
      throw new Error('Invalid userId und Arbeitszeit')
    }
    let body = {userID, urlaubstage}
    const response: ApiResponse<number> = await this.updateResource('/api/users/update/urlaubstage', body);

    if (!response.data) {
      throw new Error('No response received from the server');
    }

    if (response.code !== 200) {
      throw new Error('Failed to update Arbeitszeit');
    }

    return response.data;
  }
}
