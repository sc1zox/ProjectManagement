import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CreateProjectComponent} from './dashboard/create-project/create-project.component';
import {DashboardHomeComponent} from './dashboard/dashboard-home/dashboard-home.component';
import {MoreInformationComponent} from './dashboard/dashboard-home/more-information/more-information.component';
import { TeamRoadmapComponent } from './dashboard/team-roadmap/team-roadmap.component';
import {AdminPanelComponent} from './dashboard/admin-panel/admin-panel.component';
import {MitarbeiterFormComponent} from './dashboard/admin-panel/mitarbeiter-form/mitarbeiter-form.component';
import {TeamsFormComponent} from './dashboard/admin-panel/teams-form/teams-form.component';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: '', component: DashboardHomeComponent},
      { path: 'home', component: DashboardHomeComponent},
      { path: 'create-project', component: CreateProjectComponent},
      { path: 'team-roadmap', component: TeamRoadmapComponent},
      { path: 'more-information', component: MoreInformationComponent},
      { path: 'admin-panel', component:AdminPanelComponent},
      { path: 'admin-panel/mitarbeiter-form', component:MitarbeiterFormComponent},
      { path: 'admin-panel/teams-form', component: TeamsFormComponent},
    ]
  },
  {   // Redirekt root to login page
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
  ];

