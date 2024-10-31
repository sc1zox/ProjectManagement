import {Component} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {RightSidebarComponent} from './right-sidebar/right-sidebar.component';
import {LeftSidebarComponent} from './left-sidebar/left-sidebar.component';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    RouterModule, MatIcon, RightSidebarComponent, LeftSidebarComponent, MatDrawerContainer, MatDrawerContent,MatDrawer],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor() {
  }

  userProjects = ['Projekt E', 'Projekt A'];

}
