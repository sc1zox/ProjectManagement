import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {

  constructor(private readonly ApiService: ApiService,private readonly AuthService:AuthService) { }

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
