import {AfterViewInit, Component, Input, OnInit, ViewChild} from '@angular/core';
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
  GanttPrintService,
  GanttViewOptions,
  NgxGanttComponent,
  NgxGanttTableColumnComponent,
  NgxGanttTableComponent,
} from '@worktile/gantt';
import {de} from 'date-fns/locale';
import {Team} from '../../../../types/team';
import {projectToGantt} from '../../../../mapper/projectToGantt';
import {UserService} from '../../../../services/user.service';
import {User} from '../../../../types/user';

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
    GanttPrintService,
    {
      provide: GANTT_GLOBAL_CONFIG,
      useValue: {
        dateFormat: 'DD-MM-YYYY',
        locale: de,
      },
    },
  ],
})
export class GanttChartComponent implements OnInit, AfterViewInit {

  @Input() teams: Team[] = [];
  @Input() startDate!: GanttDate;
  currentUser?: User;
  @ViewChild('gantt') ganttComponent!: NgxGanttComponent;

  items: GanttItem[] = [];
  groups: GanttGroup[] = [];

  viewOptions: GanttViewOptions = {
    dateFormat: {
      yearQuarter: `QQQ 'of' yyyy`,
      month: 'LLLL',
      yearMonth: `LLLL yyyy'(week' w ')'`,
    },
  };

  constructor(private readonly UserService:UserService) {
  }


  async ngOnInit() {
    this.currentUser = await this.UserService.getCurrentUser();
    this.populateItems();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.ganttComponent) {
        this.jumptoFirstDate();
      }
    });
  }

  jumptoFirstDate() {
    const start = this.startDate || new GanttDate(new Date());
    this.ganttComponent.scrollToDate(start);
  }

  private populateItems() {
    this.groups = this.teams.filter(team => team.members?.some(member => member.id === this.currentUser?.id)).map((team) => ({
      id: team.id.toString(),
      title: team.name,
    }));

    this.items = [];
    for (const team of this.teams) {
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
