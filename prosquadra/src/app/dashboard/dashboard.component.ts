import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatListModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  // Static data, this needs to be fetched from the server down the line
  projects = [
    { name: 'Projekt A' },
    { name: 'Projekt B' },
    { name: 'Projekt C' },
  ];

  userProjects = ['Projekt E', 'Projekt A'];
}
