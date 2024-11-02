import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatProgressBar} from '@angular/material/progress-bar';
import {RouterLink} from '@angular/router';
import {MatAnchor} from '@angular/material/button';
import {Project} from '../../../types/project';
import {ProjectService} from '../../../services/project.service';


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatProgressBar,
    RouterLink,
    MatAnchor,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent {

  public projects:Project[];

  constructor(private ProjectService:ProjectService) {
    this.projects=this.ProjectService.getProjects();
  }
  getProgress(done: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  }
}
