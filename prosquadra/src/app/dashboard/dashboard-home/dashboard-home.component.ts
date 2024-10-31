import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatProgressBar} from '@angular/material/progress-bar';
import {Project} from '../../../types/project';
import {Router, RouterLink} from '@angular/router';
import {MatAnchor} from '@angular/material/button';

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

  constructor(private router: Router) {
  }

  // Static data, this needs to be fetched from the server down the line
  projects: Project[] = [
    { name: 'Projekt A', id: 1,userId: 1,createdAt:'',description: 'Wi.projekt1',backlogItemsDone: 50,backlogItemsTotal: 100 },
    { name: 'Projekt B', id: 2,userId: 2,createdAt:'',description: 'Wi.projekt2',backlogItemsDone: 100,backlogItemsTotal: 1000 },
    { name: 'Projekt C', id: 3,userId: 3,createdAt:'',description: 'Wi.projekt3',backlogItemsDone: 500, backlogItemsTotal: 5000 },
    { name: 'Projekt C', id: 3,userId: 3,createdAt:'',description: 'Wi.projekt3',backlogItemsDone: 500, backlogItemsTotal: 5000 },
    { name: 'Projekt C', id: 3,userId: 3,createdAt:'',description: 'Wi.projekt3',backlogItemsDone: 500, backlogItemsTotal: 5000 },
    { name: 'Projekt C', id: 3,userId: 3,createdAt:'',description: 'Wi.projekt3',backlogItemsDone: 500, backlogItemsTotal: 5000 },
    { name: 'Projekt C', id: 3,userId: 3,createdAt:'',description: 'Wi.projekt3',backlogItemsDone: 500, backlogItemsTotal: 5000 },
  ];

  getProgress(done: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((done / total) * 100);
  }
}
