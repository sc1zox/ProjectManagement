import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private tokenKey = 'authToken';
  private apiUrl: string ='';

  constructor(private ApiService: ApiService) {
    this.apiUrl=this.ApiService.getLoginUrl();
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
    const apiUrl = `${this.apiUrl}/verify-token`;

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        return true;  // Token ist gültig
      } else {
        return false;  // Token ist ungültig
      }
    } catch (error) {
      return false;  // Fehler bei der Anfrage
    }
  }



  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
