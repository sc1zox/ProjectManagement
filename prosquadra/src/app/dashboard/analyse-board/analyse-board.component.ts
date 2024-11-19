import {Component, OnInit} from '@angular/core';
import {NgIf} from '@angular/common';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {TeamService} from '../../../services/team.service';
import {Team} from '../../../types/team';
import {GanttChartComponent} from './gantt-chart/gantt-chart.component';
import {getEarliestStartDate} from '../../../helper/projectHelper';
import {GanttDate} from '@worktile/gantt';

@Component({
  selector: 'app-analyse-board',
  templateUrl: './analyse-board.component.html',
  styleUrls: ['./analyse-board.component.scss'],
  standalone: true,
  imports: [
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    GanttChartComponent,
    NgIf,
  ],
})
export class AnalyseBoardComponent implements OnInit {
  teams: Team[] = [];
  startDate: GanttDate = new GanttDate();
  protected readonly getEarliestStartDate = getEarliestStartDate;

  constructor(private readonly teamService: TeamService) {
  }

  async ngOnInit() {
    this.teams = await this.teamService.getTeams();
    this.startDate = getEarliestStartDate(this.teams);
  }
}
