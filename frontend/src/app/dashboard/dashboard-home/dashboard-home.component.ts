import {Component, OnInit} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {CommonModule} from '@angular/common';
import {RoadmapService} from '../../../services/roadmap.service';
import {Roadmap} from '../../../types/roadmap';
import {TeamRoadmapComponent} from '../team-roadmap/team-roadmap.component';
import {UserService} from '../../../services/user.service';
import {User, UserRole} from '../../../types/user';
import {SnackbarService} from '../../../services/snackbar.service';
import {fadeIn} from '../../../animations/fadeIn';
import {Router} from '@angular/router';
import {SpinnerComponent} from '../../components/spinner/spinner.component';
import {SpinnerService} from '../../../services/spinner.service';


@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    TeamRoadmapComponent,
    SpinnerComponent,
  ],
  animations: [
    fadeIn
  ],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.scss'
})
export class DashboardHomeComponent implements OnInit {

  public roadmaps: Roadmap[] = [];
  public user?: User;
  isPo: boolean = false;

  constructor(private router: Router,
              private readonly RoadmapService: RoadmapService,
              private readonly UserService: UserService,
              private readonly SnackBarService: SnackbarService,
              private spinnerService: SpinnerService,
  ) {
  }

  async ngOnInit() {
    this.spinnerService.show();
    try {
      this.user = await this.UserService.getCurrentUser();
      if( this.user && this.user.role === UserRole.Admin){
        await this.router.navigate(['dashboard/admin-panel']);
      }
      if (this.user && this.user.role === UserRole.PO) {
        this.isPo = true;
      }
      this.roadmaps = await this.RoadmapService.getRoadmaps();
    } catch (error) {
      this.SnackBarService.open('Fehler Roadmapintialisierung');
    }finally {
      this.spinnerService.hide();
    }
  }

  public async refetch() {
    try {
      this.roadmaps = await this.RoadmapService.getRoadmaps();
    } catch (error) {
      this.SnackBarService.open('Fehler refetch roadmaps')
    }
  }
}
