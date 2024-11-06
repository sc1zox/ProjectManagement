import {Component, HostListener, OnInit} from '@angular/core';
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
export class LeftSidebarComponent implements OnInit{
  public expanded: boolean = true;
  public user?: User;

  constructor(private Userservice: UserService) {
  }

  async ngOnInit() {
    try {
      this.user = await this.Userservice.getUser(5); // hardcoded because id 5 is admin in my localdb
    }catch (error){
      console.error('Error while fetching USer:', error);
    }finally {
      console.log('User fetch complete.');
    }
  }


  @HostListener('window:resize', ['$event'])
  onResize(event: Window) {
    const width = window.innerWidth;
    this.expanded = width >= 1000;
  }
}
