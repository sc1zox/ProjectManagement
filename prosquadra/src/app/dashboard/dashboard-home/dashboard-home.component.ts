import {Component, OnInit} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
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
    RouterLink,
    MatAnchor,
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit{

  public projects?:Project[];

  constructor(private ProjectService:ProjectService) {
  }

  async ngOnInit() {
    try {
      this.projects = await this.ProjectService.getProjects();
    }catch (error){
      console.error('Error while fetching Projects:', error);
    }finally {
      console.log('Project fetch finished.');
    }
  }
}
