import {Component, OnInit} from '@angular/core';
import {ArbeitszeitOverviewComponent} from './components/arbeitszeit-overview/arbeitszeit-overview.component';
import {SkillOverviewComponent} from './components/skill-overview/skill-overview.component';
import {TeamPlanungComponent} from './components/team-planung/team-planung.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow, MatHeaderRowDef, MatRow, MatRowDef,
  MatTable
} from '@angular/material/table';
import {User} from '../../../types/user';
import {UserService} from '../../../services/user.service';

@Component({
  selector: 'app-team-overview',
  standalone: true,
  imports: [
    ArbeitszeitOverviewComponent,
    SkillOverviewComponent,
    TeamPlanungComponent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
  ],
  templateUrl: './team-overview.component.html',
  styleUrl: './team-overview.component.scss'
})
export class TeamOverviewComponent implements OnInit{
  constructor(private readonly UserService: UserService) {
  }
  displayedColumns: string[] = [];
  dataSource: User[] = [];

  async ngOnInit() {
    // Berechtigungsbasierte Spaltenanzeige
    this.displayedColumns.push('userVorname')
    this.displayedColumns.push('userNachname')
    this.displayedColumns.push('skills');
    this.displayedColumns.push('workHours');
    this.displayedColumns.push('teamPlanning');

    // Daten holen
    this.dataSource = await this.UserService.getUsers();
  }
}
