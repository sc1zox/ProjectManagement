import { Component } from '@angular/core';
import {MatActionList, MatListItem} from "@angular/material/list";
import {MatExpansionPanel, MatExpansionPanelHeader, MatExpansionPanelTitle} from "@angular/material/expansion";
import {NgIf} from "@angular/common";
import {RouterLink} from '@angular/router';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    MatActionList,
    MatExpansionPanel,
    MatExpansionPanelHeader,
    MatExpansionPanelTitle,
    MatListItem,
    NgIf,
    RouterLink,
    MatButton
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss'
})
export class AdminPanelComponent {

}
