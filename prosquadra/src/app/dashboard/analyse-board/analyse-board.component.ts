import { Component, inject } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';
import {AsyncPipe, NgForOf} from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import {CardComponent} from './card/card.component';
import {LinechartComponent} from './charts/linechart/linechart.component';

interface Card {
  title: string;
  cols: number;
  rows: number;
}

@Component({
  selector: 'app-analyse-board',
  templateUrl: './analyse-board.component.html',
  styleUrl: './analyse-board.component.scss',
  standalone: true,
  imports: [
    AsyncPipe,
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    CardComponent,
    NgForOf,
    LinechartComponent,
  ]
})
export class AnalyseBoardComponent {
  // https://www.smashingmagazine.com/2020/07/responsive-dashboard-angular-material-ng2-charts-schematics/
  cards: Card[] = [
    { title: 'Card 1', cols: 1, rows: 1 },
    { title: 'Card 2', cols: 1, rows: 1 },
    { title: 'Card 3', cols: 1, rows: 2 },
    { title: 'Card 4', cols: 2, rows: 1 },
  ];
}
