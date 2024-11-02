import {Component, HostListener} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {MatIcon} from '@angular/material/icon';
import {RightSidebarComponent} from './right-sidebar/right-sidebar.component';
import {LeftSidebarComponent} from './left-sidebar/left-sidebar.component';
import {MatDrawer, MatDrawerContainer, MatDrawerContent} from '@angular/material/sidenav';
import {MatExpansionPanel} from '@angular/material/expansion';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    RouterModule, MatIcon, RightSidebarComponent, LeftSidebarComponent, MatDrawerContainer, MatDrawerContent, MatDrawer, MatExpansionPanel],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  isExpanded: boolean = false; // Zustand der Sidebar

  toggleSidebar(): void {
    if (window.innerWidth >= 1000) {
      this.isExpanded = !this.isExpanded;
    } else {
      this.isExpanded = true; // Always expand on mobile when toggled
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (window.innerWidth < 1000) {
      this.isExpanded = false;
    }
  }
}
