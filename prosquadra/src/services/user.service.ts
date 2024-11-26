import {Injectable} from '@angular/core';
import {User} from '../types/user';
import {ApiService} from './api.service';
import {ApiResponse} from '../types/api-response';
import {Login} from '../types/login';
import {Estimation} from '../types/estimation';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private User?: User;
  private userPromise?: Promise<User>;

  constructor(private readonly ApiService: ApiService) {
  }


  async getUsers(): Promise<User[]> {
    try {
      console.log("Fetching users from API...");
      const response: ApiResponse<User[]> = await this.ApiService.fetch("/users");

      if (response.code !== 200) {
        throw new Error("Network response was not ok while fetching all users");
      }

      return response.data;
    } catch (error) {
      console.error("Error in getUsers:", error);
      throw new Error("Network error occurred while fetching users: " + error);
    }
  }


  async getUser(userId: number): Promise<User> {

    const response: ApiResponse<User> = await this.ApiService.fetch(`/users/`+userId);

    if (response.code !== 200) {
      throw new Error('Failed to fetch user data for specific id:' + userId);
    }

    return response.data;
  }

  async createUser(user: User): Promise<User> {
    const response: ApiResponse<User> = await this.ApiService.post("/users/create", user);

    if (!response.data) {
      throw new Error('No response received from the server');
    }

    if (response.code !== 201) {
      throw new Error('Failed to create user');
    }
    return response.data;
  }

  async createLogin(Login: Login): Promise<Login> {
    let LoginUrl = this.ApiService.getAuthUrl() + "/create";
    const response: ApiResponse<Login> = await this.ApiService.postWithUrl(LoginUrl, Login);

    if (!response.data) {
      throw new Error('No response received from the server');
    }

    if (response.code !== 201) {
      throw new Error('Failed to create Login');
    }

    return response.data;
  }

  async setCurrentUser(login: Login): Promise<void> {
    console.log("setCurrentUserFunc: ", login);

    try {
      const users = await this.getUsers();
      const foundUser = users.find(user => user.id === login.userId);

      if (foundUser) {
        console.log("User found:", foundUser);
        this.User = foundUser;
      } else {
        console.log("User not found with userId:", login.userId);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }

  async getCurrentUser(): Promise<User | undefined> {
    if (this.User) {
      console.log("Returning cached user:", this.User);
      return this.User;
    }
    if (this.userPromise) {
      console.log("Waiting for the user to be fetched...");
      return this.userPromise;
    }

    console.log("No cached user found and no fetch in progress.");
    return undefined;
  }

  async getUserEstimation(userId: number): Promise<Estimation[]> {

    const response: ApiResponse<Estimation[]> = await this.ApiService.fetch(`/users/estimations/`+userId);

    if (response.code !== 200) {
      throw new Error('Failed to fetch estimations for user:' + userId);
    }

    return response.data;
  }


}
