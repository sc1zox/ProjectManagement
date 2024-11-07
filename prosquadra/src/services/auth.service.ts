import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private tokenKey = 'authToken';
  private apiUrl = '';

  constructor(private ApiService: ApiService) {
    this.apiUrl = this.ApiService.getLoginUrl();
  }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;  // Returns true if the token exists
  }


  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
