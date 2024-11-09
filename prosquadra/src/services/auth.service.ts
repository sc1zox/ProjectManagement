import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private tokenKey = 'authToken';
  private apiUrl: string ='';

  constructor(private ApiService: ApiService) {
    this.apiUrl=this.ApiService.getAuthUrl();
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  isAuthenticated(): Promise<boolean> {
    const token = this.getToken();
    if (!token) {
      return Promise.resolve(false);
    }

    return this.verifyToken(token);
  }

  private async verifyToken(token: string): Promise<boolean> {
    const apiUrl = this.apiUrl + '/verify-token';

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        console.log('token gültig')
        return true;
      } else {
        console.log('token ist ungültig')
        return false;
      }
    } catch (error) {
      return false;
    }
  }



  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
