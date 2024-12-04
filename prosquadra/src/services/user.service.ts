import { Injectable } from '@angular/core';
import { User } from '../types/user';
import { ApiService } from './api.service';
import { ApiResponse } from '../types/api-response';
import { Login } from '../types/login';
import { Estimation } from '../types/estimation';
import {Urlaub} from '../types/urlaub';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private User?: User;
  private userPromise?: Promise<User>;

  constructor(private readonly ApiService: ApiService) {
  }

  async getUsers(): Promise<User[]> {
    try {
      const response: ApiResponse<User[]> = await this.ApiService.fetch('/users');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getUser(userId: number): Promise<User> {
    try {
      const response: ApiResponse<User> = await this.ApiService.fetch(`/users/`+userId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createUser(user: User): Promise<User> {
    try {
      const response: ApiResponse<User> = await this.ApiService.post('/users/create', user);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createLogin(login: Login): Promise<Login> {
    try {
      const loginUrl = this.ApiService.getAuthUrl() + '/create';
      const response: ApiResponse<Login> = await this.ApiService.postWithUrl(loginUrl, login);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async setCurrentUser(login: Login): Promise<void> {
    try {
      const users = await this.getUsers();
      const foundUser = users.find((user) => user.id === login.userId);
      if (foundUser) {
        this.User = foundUser;
      }
    } catch (error) {
      throw error;
    }
  }

  async getCurrentUser(): Promise<User | undefined> {
    try {
      if (this.User) {
        return this.User;
      }
      if (this.userPromise) {
        return this.userPromise;
      }
      return undefined;
    } catch (error) {
      throw error;
    }
  }

  async getUserEstimation(userId: number): Promise<Estimation[]> {
    try {
      const response: ApiResponse<Estimation[]> = await this.ApiService.fetch(`/users/estimations/`+userId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateArbeitszeit(userID: number, arbeitszeit: number): Promise<number> {
    if (!userID || !arbeitszeit) {
      throw new Error('Invalid userId und Arbeitszeit');
    }
    try {
      const data = { userID, arbeitszeit };
      const response: ApiResponse<number> = await this.ApiService.put('/users/update/arbeitszeit', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async updateUrlaubstage(userID: number, urlaubstage: number): Promise<number> {
    if (!userID || !urlaubstage) {
      throw new Error('Invalid userId und Urlaubstage');
    }
    try {
      const data = { userID, urlaubstage };
      const response: ApiResponse<number> = await this.ApiService.put('/users/update/urlaubstage', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async sendUrlaubRequest(userId: number, startDatum: Date, endDatum: Date): Promise<Urlaub> {
    if (!userId || !startDatum || !endDatum) {
      throw new Error('Invalid userId, startDate, or endDate');
    }
    try {
      const data: Urlaub = { userId, startDatum, endDatum };
      const response: ApiResponse<Urlaub> = await this.ApiService.post('/users/vacations/set', data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteUrlaub (urlaub: Urlaub): Promise<void> {
    if (!urlaub) {
      throw new Error('Invalid urlaub');
    }
    try {
      await this.ApiService.delete('/users/vacations/delete/'+ urlaub.id);
    } catch (error) {
      throw error;
    }
  }

  async getUserUrlaub (user: User): Promise<Urlaub[]> {
    if (!user) {
      throw new Error('Invalid user');
    }
    try {
      const response: ApiResponse<Urlaub[]> = await this.ApiService.fetch('/users/vacations/'+ user.id);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
