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
import {SpinnerComponent} from "../../components/spinner/spinner.component";
import {SpinnerService} from '../../../services/spinner.service';

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
        SpinnerComponent,
    ],
})
export class AnalyseBoardComponent implements OnInit {
  teams: Team[] = [];
  startDate: GanttDate = new GanttDate();
  protected readonly getEarliestStartDate = getEarliestStartDate;

  constructor(private readonly TeamService: TeamService,private readonly SnackBarService: SnackbarService, private readonly SpinnerService: SpinnerService) {
  }

  async ngOnInit() {
    this.SpinnerService.show();
    try {
      this.teams = await this.TeamService.getTeams();
    }catch (error){
      this.SnackBarService.open('Could not load the teams')
    }finally {
      this.SpinnerService.hide();
    }
    this.startDate = getEarliestStartDate(this.teams);
  }
}
