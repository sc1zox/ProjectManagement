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
import {SnackbarService} from '../../../services/snackbar.service';

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

  constructor(private readonly TeamService: TeamService,private readonly SnackBarService: SnackbarService) {
  }

  async ngOnInit() {
    try {
      this.teams = await this.TeamService.getTeams();
    }catch (error){
      this.SnackBarService.open('Konnte die Teams nicht laden')
    }
    this.startDate = getEarliestStartDate(this.teams);
  }
}
