import { Component, HostListener } from '@angular/core';
import { MatActionList, MatListItem, MatNavList } from "@angular/material/list";
import { RouterLink } from '@angular/router';
import { MatExpansionPanel, MatExpansionPanelDescription, MatExpansionPanelHeader, MatExpansionPanelTitle } from '@angular/material/expansion';
import { NgIf } from '@angular/common';
import {UserService} from '../../../services/user.service';
import {User} from '../../../types/user';


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
    MatExpansionPanelDescription,
    NgIf
  ],
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.scss']
})
export class LeftSidebarComponent {
  public expanded: boolean = true;
  public user:User;

  constructor(private Userservice: UserService) {
    this.user = this.Userservice.getUser(2);
  }



  @HostListener('window:resize', ['$event'])
  onResize(event: Window) {
    const width = window.innerWidth;
    this.expanded = width >= 1000;
  }
}
