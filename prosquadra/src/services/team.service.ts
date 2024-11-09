import { Injectable } from '@angular/core';
import { User, UserRole } from '../types/user';
import { Roadmap } from '../types/roadmap';
import { Team } from '../types/team';
import { ApiService } from './api.service';
import {ApiResponse} from '../types/api-response';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(private apiService: ApiService) {}

  public async getTeams(): Promise<Team[]> {
    const response: ApiResponse<Team[]> = await this.apiService.fetch('/teams');
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
}
