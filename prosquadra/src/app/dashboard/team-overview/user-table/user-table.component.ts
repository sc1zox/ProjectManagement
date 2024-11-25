import {Component, Input, OnInit} from '@angular/core';
import {ArbeitszeitOverviewComponent} from '../components/arbeitszeit-overview/arbeitszeit-overview.component';
import {SkillOverviewComponent} from '../components/skill-overview/skill-overview.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable
} from '@angular/material/table';
import {User, UserRole} from '../../../../types/user';
import {UserDetailsModalComponent} from '../components/user-details-modal/user-details-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {MatButton} from '@angular/material/button';
import {TeamPlanungComponent} from '../components/team-planung/team-planung.component';
import {UserService} from '../../../../services/user.service';

@Component({
  selector: 'app-user-table',
  standalone: true,
  imports: [
    ArbeitszeitOverviewComponent,
    SkillOverviewComponent,
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
    MatButton,
    TeamPlanungComponent,
  ],
  templateUrl: './user-table.component.html',
  styleUrl: './user-table.component.scss'
})
export class UserTableComponent implements OnInit {
  displayedColumns: string[] = [];
  @Input() user: User[] = [];
  currentUser?: User;
  protected readonly UserRole = UserRole;

  constructor(private readonly dialog: MatDialog, private readonly UserService: UserService) {
  }

  async ngOnInit() {
    this.currentUser = await this.UserService.getCurrentUser();

    this.displayedColumns.push('userVorname')
    this.displayedColumns.push('userNachname')
    this.displayedColumns.push('skills');
    this.displayedColumns.push('workHours');
    this.displayedColumns.push('vacationDays')
    this.displayedColumns.push('teamPlanning');
    this.displayedColumns.push('modal')
  }

  openModal(user: User, currentUser: User | undefined) {
    this.dialog.open(UserDetailsModalComponent, {
      data: {user, currentUser},
    });
  }


}
