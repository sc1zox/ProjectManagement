import {Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {ApiResponse} from '../types/api-response';
import {Roadmap} from '../types/roadmap';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {

  private roadmaps: Roadmap[] = [];

  constructor(private readonly ApiService: ApiService) {
  }

  public async getRoadmaps(): Promise<Roadmap[]> {
    const response: ApiResponse<Roadmap[]> = await this.ApiService.fetch('/roadmaps');
    if (response.code !== 200) {
      throw new Error('Failed to fetch roadmaps');
    }
    this.roadmaps = response.data;
    return response.data;
  }

  public getStaticRoadmaps() {
    if (this.roadmaps) {
      return this.roadmaps;
    } else {
      this.getRoadmaps();
    }
    return this.roadmaps;
  }

  public async getRoadmapsbyTeamID(id: number): Promise<Roadmap | undefined> {

    await this.getRoadmaps();

    return this.roadmaps.find(roadmap => roadmap.id === id);
  }

}
