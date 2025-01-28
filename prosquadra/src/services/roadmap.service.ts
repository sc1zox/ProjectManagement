import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ApiResponse} from '../types/api-response';
import {Roadmap} from '../types/roadmap';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {

  constructor(private readonly ApiService: ApiService) {
  }

  public async getRoadmaps(): Promise<Roadmap[]> {
    try {
      const response: ApiResponse<Roadmap[]> = await this.ApiService.fetch('/roadmaps');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  public async updateRoadmap(roadmap: Roadmap) {
    try {
      const response:ApiResponse<string> = await this.ApiService.put('/roadmaps/update', roadmap);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async getRoadmapById(ID: number | undefined): Promise<Roadmap> {
    try {
      const response: ApiResponse<Roadmap> = await this.ApiService.fetch('/roadmaps/' + ID);
      return response.data
    } catch (error) {
      throw error;
    }
  }
}
