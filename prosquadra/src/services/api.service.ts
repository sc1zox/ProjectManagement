// api.service.ts
import {Injectable} from '@angular/core';
import {ApiResponse} from '../types/api-response';
import {AuthService} from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'http://localhost:3000/api';
  private readonly baseUrl: string = 'http://localhost:3000';

  constructor() {}

  getLoginUrl(){
    return this.baseUrl+'/auth/login';
  }
  getAuthUrl(){
    return this.baseUrl+'/auth';
  }
  getBaseUrl(): string{
    return this.baseUrl;
  }

  async fetch<T>(endpoint: string): Promise<ApiResponse<T>> {
    let response;
    try {
      response = await fetch(`${this.apiUrl}${endpoint}`);
    }
    catch (error){
      throw new Error ("api fetch failed" + error)
    }
    if (response && !response.ok) {
      const errorData = await response.json();
      throw new Error(`Error: ${errorData.error || 'Unknown error'}`);
    }
    return await response.json();
  }


  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Error: ${errorResponse.error}`);
    }

    return response.json();
  }

  async postUrl<T>(url: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(`Error: ${errorResponse.error}`);
    }

    return response.json();
  }
}
