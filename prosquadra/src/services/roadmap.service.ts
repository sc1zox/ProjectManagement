import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ApiResponse} from '../types/api-response';
import {Roadmap} from '../types/roadmap';
import {UpdateService} from './update.service';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {

  private roadmaps: Roadmap[] = [];

  constructor(private readonly ApiService: ApiService, private readonly UpdateService: UpdateService) {
  }

  public async getRoadmaps(): Promise<Roadmap[]> {
    const response: ApiResponse<Roadmap[]> = await this.ApiService.fetch('/roadmaps');
    if (response.code !== 200) {
      throw new Error('Failed to fetch roadmaps');
    }
    this.roadmaps = response.data;
    return response.data;
  }

  public async updateRoadmap(roadmap: Roadmap) {
    try {
      await this.UpdateService.updateResourceWithAuthentification('/api/roadmaps/update', roadmap);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  }

  async getRoadmapById(ID: number | undefined): Promise<Roadmap> {

    const response: ApiResponse<Roadmap> = await this.ApiService.fetch('/roadmaps/' + ID);

    if (response.code !== 200) {
      throw new Error('Failed to fetch roadmap for specific id:' + ID);
    }

    return response.data;
  }
}
