import {Component, HostListener} from '@angular/core';
import {MatActionList, MatListItem, MatNavList} from "@angular/material/list";
import {RouterLink} from '@angular/router';
import {
  MatExpansionPanel,
  MatExpansionPanelDescription,
  MatExpansionPanelHeader,
  MatExpansionPanelTitle
} from '@angular/material/expansion';

@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [
    MatListItem,
    MatNavList,
    RouterLink,
    MatActionList,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    MatExpansionPanelDescription
  ],
  templateUrl: './left-sidebar.component.html',
  styleUrl: './left-sidebar.component.scss'
})
export class LeftSidebarComponent {

  public expanded: boolean = true;

  @HostListener('window:resize', ['$event'])
  onResize(event: Window) {
    const width = window.innerWidth;
    // Set expanded to false if the width is less than 1000px
    this.expanded = width >= 1000;
  }

  // Initialize the expansion state based on the current window size
  constructor() {
    this.onResize(window); // Call onResize once during initialization
  }
}
