// api.service.ts
import {Injectable} from '@angular/core';
import {ApiResponse} from '../types/api-response';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api'; // Basis-URL für die API

  constructor() {}


  async fetch<T>(endpoint: string): Promise<ApiResponse<T>> {
    const response = await fetch(`${this.apiUrl}${endpoint}`);
    if (!response.ok) {
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
}
