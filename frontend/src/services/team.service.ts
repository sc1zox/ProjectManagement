import { Injectable, OnInit } from '@angular/core';
import { Team } from '../types/team';
import { ApiService } from './api.service';
import { ApiResponse } from '../types/api-response';

@Injectable({
  providedIn: 'root'
})
export class TeamService implements OnInit {

  teams: Team[] = [];

  constructor(private readonly apiService: ApiService) {}

  async ngOnInit(): Promise<void> {
    try {
      this.teams = await this.getTeams();
    } catch (error) {
      console.error('Error initializing TeamService:', error);
      throw new Error('Initialization Error')
    }
  }

  async getTeams(): Promise<Team[]> {
    try {
      const response: ApiResponse<Team[]> = await this.apiService.fetch('/team');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async createTeam(team: Team): Promise<Team> {
    try {
      const response: ApiResponse<Team> = await this.apiService.post('/team/create', team);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getTeamById(teamId: number): Promise<Team> {
    try {
      const response: ApiResponse<Team> = await this.apiService.fetch(`/team/`+teamId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getTeamsByUserId(userId: number): Promise<Team[]> {
    try {
      const response: ApiResponse<Team[]> = await this.apiService.fetch(`/team/user/`+userId);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async deleteTeam(teamId: number): Promise<void>{
    try{
      await this.apiService.delete('/team/delete/'+ teamId);
    }catch (error){
      throw error;
    }
  }

  async removeUserFromTeam(userId: number, teamId: number): Promise<void> {
    const body = { userId, teamId };
    try {
      const response: ApiResponse<void> = await this.apiService.post('/team/user/delete', body);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async addUserToTeam(userId: number, teamId: number): Promise<void> {
    const body = { userId, teamId };
    try {
      const response: ApiResponse<void> = await this.apiService.post('/team/user/add', body);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
