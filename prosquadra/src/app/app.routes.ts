import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CreateProjectComponent} from './dashboard/create-project/create-project.component';
import {DashboardHomeComponent} from './dashboard/dashboard-home/dashboard-home.component';
import {MoreInformationComponent} from './dashboard/dashboard-home/more-information/more-information.component';
import { TeamRoadmapComponent } from './team-roadmap/team-roadmap.component';

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
      { path: 'team-roadmap.ts', component: TeamRoadmapComponent},
      { path: 'more-information', component: MoreInformationComponent}
    ]
  },
  {   // Redirekt root to login page
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
  ];

