import {Injectable} from '@angular/core';
import {Skill} from '../types/skill';
import {ApiService} from './api.service';
import {ApiResponse} from '../types/api-response';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  constructor(private readonly ApiService: ApiService) {
  }

  async addSkill(skillName: string, userId: number): Promise<Skill[]> {
    try {
      let body = {userId: userId, skillName: skillName}
      const response: ApiResponse<Skill[]> = await this.ApiService.post("/skills/add", body);
      return response.data
    } catch (error){
      throw error;
    }
  }

  async getSkill(userId: number): Promise<Skill[]> {
    try {
      const response: ApiResponse<Skill[]> = await this.ApiService.fetch("/skills/" + userId);
      return response.data;
    }catch (error){
      throw error;
    }
  }

  async getAllSkills(): Promise<Skill[]> {
    try {
      const response: ApiResponse<Skill[]> = await this.ApiService.fetch("/skills/all");
      return response.data;
    }catch (error){
      throw error;
    }
  }

  async removeSkill(skillName: string, userId: number): Promise<Skill[]> {
    try {
      let body = {userId: userId, skillName: skillName};
      const response: ApiResponse<Skill[]> = await this.ApiService.post("/skills/remove", body);
      return response.data;
    }catch (error){
      throw error;
    }
  }
}
