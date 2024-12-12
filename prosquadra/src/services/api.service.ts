import {Injectable, OnInit} from '@angular/core';
import {ApiResponse} from '../types/api-response';
import {ApiError} from '../error/ApiError';


@Injectable({
  providedIn: 'root'
})
export class ApiService{
  private readonly apiUrl = 'http://localhost:3000/api';
  private readonly baseUrl: string = 'http://localhost:3000';
  private readonly tokenKey = 'authToken';

  constructor() {
  }

  getLoginUrl() {
    return this.baseUrl + '/auth/login';
  }

  getAuthUrl() {
    return this.baseUrl + '/auth';
  }

  getBaseUrl(): string {
    return this.baseUrl;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  async fetch<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response: Response = await fetch(this.apiUrl + endpoint,{
      headers: {
        'Authorization': `Bearer ${this.getToken()}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData.message || 'Unknown error');
    }

    return await response.json();
  }


  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response:Response = await fetch(this.apiUrl+endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData.message || 'Unknown error');
    }

    return response.json();
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(this.apiUrl+endpoint, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData.message || 'Unknown error');
    }

    return response.json();
  }

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    const response: Response = await fetch(this.apiUrl + endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData.message || 'Unknown error');
    }

    return response.json();
  }

  async putWithoutBody<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response: Response = await fetch(this.apiUrl + endpoint, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData.message || 'Unknown error');
    }

    return response.json();
  }

  async postWithUrl<T>(url: string, body: any): Promise<ApiResponse<T>> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getToken()}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(response.status, errorData.message || 'Unknown error');
    }

    return response.json();
  }


  //helper to avoid circular DI
  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}
