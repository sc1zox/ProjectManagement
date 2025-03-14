import {Component, HostListener, OnInit} from '@angular/core';
import {MatActionList, MatListItem} from "@angular/material/list";
import {RouterLink} from '@angular/router';
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from '@angular/material/expansion';
import {NgIf, NgClass} from '@angular/common';
import {UserService} from '../../../services/user.service';
import {User, UserRole} from '../../../types/user';


@Component({
  selector: 'app-left-sidebar',
  standalone: true,
  imports: [
    MatListItem,
    RouterLink,
    MatActionList,
    MatExpansionPanelHeader,
    MatExpansionPanel,
    MatExpansionPanelTitle,
    NgIf,
  ],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent implements OnInit {
  public expanded: boolean = true;
  public user?: User;
  protected readonly UserRole = UserRole;

  constructor(private readonly Userservice: UserService) {
  }

  async ngOnInit() {
    try {
      this.user = await this.Userservice.getCurrentUser();
    } catch (error) {
      console.error('Error while fetching USer:', error);
    } finally {
      console.log('User fetch complete.');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Window) {
    const width = window.innerWidth;
    this.expanded = width >= 1000;
  }
}
