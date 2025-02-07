import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {
  GANTT_GLOBAL_CONFIG,
  GanttDate,
  GanttGroup,
  GanttItem,
  GanttViewOptions, GanttViewType,
  NgxGanttComponent,
  NgxGanttTableColumnComponent,
  NgxGanttTableComponent,
} from '@worktile/gantt';
import {de} from 'date-fns/locale';
import {Team} from '../../../../types/team';
import {projectToGantt} from '../../../../mapper/projectToGantt';
import {UserService} from '../../../../services/user.service';
import {User} from '../../../../types/user';
import { TeamService } from '../../../../services/team.service';
import { SnackbarService } from '../../../../services/snackbar.service';

@Component({
  selector: 'app-gantt-chart',
  standalone: true,
  templateUrl: './gantt-chart.component.html',
  styleUrl: './gantt-chart.component.scss',
  imports: [
    MatGridListModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    NgxGanttComponent,
    NgxGanttTableComponent,
    NgxGanttTableColumnComponent,
  ],
  providers: [
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        dateFormat: 'DD-MM-YYYY',
        locale: de,
      },
    },
  ],
})
export class GanttChartComponent implements OnInit {

  @Input() teams: Team[] = [];
  @Input() earliestStartAndEndDate!: { earliest: GanttDate; latest: GanttDate };
  currentUser?: User;
  @ViewChild('gantt') ganttComponent!: NgxGanttComponent;
  protected readonly GanttViewType = GanttViewType;

  items: GanttItem[] = [];
  groups: GanttGroup[] = [];

  viewOptions: GanttViewOptions = {
    dateFormat: {
      yearQuarter: `QQQ 'of' yyyy`,
      month: 'LLLL',
      yearMonth: `LLLL yyyy'(week' w ')'`,
    },
  };


  constructor(private readonly UserService:UserService,
    private readonly TeamService:TeamService,
    private readonly SnackBarService: SnackbarService) {
  }


  async ngOnInit() {
    this.currentUser = await this.UserService.getCurrentUser();
    await this.populateItems();
  }


  private async populateItems() {
    let teamsToDisplay: Team[] = []

    if (this.currentUser?.role == "Bereichsleiter")
    {
      try {
        teamsToDisplay = await this.TeamService.getTeams();
        teamsToDisplay = teamsToDisplay.filter(team => team.id !== 1); // Filter Admin / Initialiser Team
        this.groups = teamsToDisplay.map((team) => ({
          id: team.id.toString(),
          title: team.name,
        }));
      } catch (error) {
        this.SnackBarService.open('Error fetching teams');
        teamsToDisplay = [];
      }
    } else {
      teamsToDisplay = this.teams;
      this.groups = this.teams.filter(team => team.members?.some(member => member.id === this.currentUser?.id)).map((team) => ({
        id: team.id.toString(),
        title: team.name,
      }));
    }

    this.items = [];
    for (const team of teamsToDisplay) {
      if (team.projects && team.projects.length > 0) {
        this.items.push(
          ...team.projects.map((project) =>
            projectToGantt(project, team.id.toString())
          )
        );
      }
    }
  }
}
