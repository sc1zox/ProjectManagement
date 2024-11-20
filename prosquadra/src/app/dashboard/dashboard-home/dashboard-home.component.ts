import {Component, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {RoadmapService} from '../../../services/roadmap.service';
import {Roadmap} from '../../../types/roadmap';
import {TeamRoadmapComponent} from '../team-roadmap/team-roadmap.component';
import {UserService} from '../../../services/user.service';
import {User, UserRole} from '../../../types/user';


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    TeamRoadmapComponent,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {

  public roadmaps: Roadmap[] = [];
  public user?: User;
  isPo: boolean = false;

  constructor(private readonly RoadmapService: RoadmapService, private readonly UserService: UserService) {
  }

  async ngOnInit() {
    try {
      this.user = await this.UserService.getCurrentUser();
      if (this.user && this.user.role === UserRole.PO) {
        this.isPo = true;
      }
      this.roadmaps = await this.RoadmapService.getRoadmaps();
      console.log('ROADMAPS', this.roadmaps)
    } catch (error) {
      console.error('Error while fetching Roadmaps:', error);
    }
  }

  public async refetch() {
    try {
      this.roadmaps = await this.RoadmapService.getRoadmaps();
    } catch (error) {
      console.error('Error refetching roadmaps:', error);
    }
  }
}
