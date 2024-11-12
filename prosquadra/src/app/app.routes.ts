import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateProjectComponent } from './dashboard/create-project/create-project.component';
import { DashboardHomeComponent } from './dashboard/dashboard-home/dashboard-home.component';
import { MoreInformationComponent } from './dashboard/dashboard-home/more-information/more-information.component';
import { AdminPanelComponent } from './dashboard/admin-panel/admin-panel.component';
import { MitarbeiterFormComponent } from './dashboard/admin-panel/mitarbeiter-form/mitarbeiter-form.component';
import { TeamsFormComponent } from './dashboard/admin-panel/teams-form/teams-form.component';
import { AnalyseBoardComponent } from './dashboard/analyse-board/analyse-board.component';
import { AuthGuard } from '../auth/auth.guard';
import {MyTeamRoadmapComponent} from './dashboard/my-team-roadmap/my-team-roadmap.component';
import {TeamOverviewComponent} from './dashboard/team-overview/team-overview.component';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: DashboardHomeComponent },
      { path: 'home', component: DashboardHomeComponent },
      { path: 'create-project', component: CreateProjectComponent },
      { path: 'team-roadmap', component: MyTeamRoadmapComponent },
      { path: 'more-information', component: MoreInformationComponent },
      { path: 'admin-panel', component: AdminPanelComponent },
      { path: 'admin-panel/mitarbeiter-form', component: MitarbeiterFormComponent },
      { path: 'admin-panel/teams-form', component: TeamsFormComponent },
      { path: 'analyse-board', component: AnalyseBoardComponent },
      { path: 'team-overview',component:TeamOverviewComponent },
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
