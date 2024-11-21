import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {UserService} from './user.service';
import {UserRole} from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private readonly tokenKey = 'authToken';
  private apiUrl: string = '';

  constructor(private readonly ApiService: ApiService, private readonly UserService: UserService) {
    this.apiUrl = this.ApiService.getAuthUrl();
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

  logout(): void {
    localStorage.removeItem(this.tokenKey);
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
        const data = await response.json();
        await this.UserService.setCurrentUser(data.user);
        return true;
      } else {
        console.log('token ist ungültig')
        return false;
      }
    } catch (error) {
      return false;
    }
  }

  async hasRole(requiredRoles: UserRole[]): Promise<boolean> {
    const currentUser = await this.UserService.getCurrentUser();
    if (currentUser && currentUser.role) {
      return requiredRoles.includes(currentUser.role);
    }
    return false;
  }
}
