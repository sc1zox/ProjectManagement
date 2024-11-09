import {Injectable} from '@angular/core';
import { User} from '../types/user';
import {ApiService} from './api.service';
import {ApiResponse} from '../types/api-response';
import {Login} from '../types/login';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private User?: User;

  constructor(private ApiService: ApiService) {
  }


  async getUsers(): Promise<User[]> {
    try {
      console.log("Fetching users from API...");
      const response:ApiResponse<User[]> = await this.ApiService.fetch("/users");

      console.log("Response received:", response);

      if (typeof response !== 'object' || response === null) {
        throw new Error("Response is not a valid object");
      }

      if (!response.data) {
        throw new Error("Response structure is invalid");
      }

      if (response.code !== 200) {
        throw new Error("Network response was not ok while fetching all users");
      }

      return <User[]>response.data;
    } catch (error) {
      console.error("Error in getUsers:", error);
      throw new Error("Network error occurred while fetching users: " + error);
    }
  }


  async getUser(ID: number): Promise<User> {

    const response:ApiResponse<User> = await this.ApiService.fetch(`/users/${ID}`);

    if (response.code !== 200) {
      throw new Error('Failed to fetch user data for specific id:' + ID);
    }

    return <User>response.data;
  }

  async createUser(user: User): Promise<User> {
    const response: ApiResponse<User> = await this.ApiService.post("/users/create",user);

    if (!response.data) {
      throw new Error('No response received from the server');
    }

    if (response.code !== 201) {
      throw new Error('Failed to create user');
    }
    return <User>response.data;
  }

  async createLogin(Login: Login): Promise<Login> {
    let LoginUrl = this.ApiService.getAuthUrl()+"/create";
    const response: ApiResponse<Login> = await this.ApiService.postUrl(LoginUrl,Login);

    if (!response.data) {
      throw new Error('No response received from the server');
    }

    if (response.code !== 201) {
      throw new Error('Failed to create Login');
    }

    return <Login>response.data;
  }

  setCurrentUser(user: User): void {
    this.User = user;
  }
  getCurrentUser(): User {
    if (this.User !== undefined) {
      return this.User;
    } else {
      throw new Error('No user is currently set');
    }
  }
}
