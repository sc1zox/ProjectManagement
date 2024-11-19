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
    let body = {userId: userId, skillName: skillName}
    const response: ApiResponse<Skill[]> = await this.ApiService.post("/skills/add", body);
    if (response.code !== 200) {
      throw new Error('Failed to create skill');
    }
    return response.data;
  }

  async getSkill(userId: number): Promise<Skill[]> {
    const response: ApiResponse<Skill[]> = await this.ApiService.fetch("/skills/" + userId);
    console.log("RESPONSE:", response)
    if (response.code !== 200) {
      throw new Error('Failed to fetch skills');
    }
    return response.data;
  }

  async getAllSkills(): Promise<Skill[]> {
    const response: ApiResponse<Skill[]> = await this.ApiService.fetch("/skills/all");
    if (response.code !== 201) {
      throw new Error('Failed to fetch skills');
    }
    return response.data;
  }

  async removeSkill(skillName: string, userId: number): Promise<Skill[]> {
    let body = {userId: userId, skillName: skillName};
    const response: ApiResponse<Skill[]> = await this.ApiService.post("/skills/remove", body);
    if (response.code !== 200) {
      throw new Error('Failed to remove skill');
    }
    return response.data;
  }
}
