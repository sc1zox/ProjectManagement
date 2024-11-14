import { Injectable } from '@angular/core';
import { Team } from '../types/team';
import { ApiService } from './api.service';
import {ApiResponse} from '../types/api-response';


@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private readonly apiService: ApiService) {}

  public async getTeams(): Promise<Team[]> {
    const response: ApiResponse<Team[]> = await this.apiService.fetch('/team');
    if (response.code !== 200) {
      throw new Error('Failed to fetch teams');
    }
    return response.data;
  }

  public async createTeam(team: Team): Promise<Team> {
    const response:ApiResponse<Team> = await this.apiService.post('/team/create', team);
    if (response.code !== 201) {
      throw new Error('Failed to create team');
    }
    return response.data;
  }

  async getTeamByID(ID: number): Promise<Team> {

    const response:ApiResponse<Team> = await this.apiService.fetch('/team/'+ID);

    if (response.code !== 200) {
      throw new Error('Failed to fetch team data for specific id:' + ID);
    }

    return response.data;
  }

  async getTeamByUserID(ID: number): Promise<Team[]>{
    const response: ApiResponse<Team[]> = await this.apiService.fetch('/team/user/'+ID);

    if (response.code !== 200) {
      throw new Error('Failed to fetch team data for specific id:' + ID);
    }

    return response.data;
  }
}
