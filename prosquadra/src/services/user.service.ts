import {Injectable} from '@angular/core';
import {User} from '../types/user';
import {ProjectService} from './project.service';
import {ApiService} from './api.service';
import {Project} from '../types/project';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private ProjectService: ProjectService,private ApiService: ApiService) {
  }


  async getUsers(): Promise<User[]> {
    const response = await this.ApiService.fetch("/users");
    if (response.code!==200) {
      throw new Error('Network response was not ok');
    }
    return <User[]>response.data;
  }

  async getUser(ID: number): Promise<User> {

    const response = await this.ApiService.fetch(`/users/${ID}`);

    if (response.code !== 200) {
      throw new Error('Failed to fetch user data');
    }

    return <User>response.data;
  }

  async createUser(user: User): Promise<User> {
    const response = await this.ApiService.post("/users",user);


    if (response.code !== 201) {
      throw new Error('Failed to create user');
    }


    return <User>response.data;
  }

}
