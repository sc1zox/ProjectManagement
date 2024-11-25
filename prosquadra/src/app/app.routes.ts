import {Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthGuard} from '../auth/auth.guard';
import {DashboardHomeComponent} from './dashboard/dashboard-home/dashboard-home.component';
import {UserRole} from '../types/user';

export const routes: Routes = [
  {
    path: 'login', component: LoginComponent
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      {path: '', component: DashboardHomeComponent}, // Diese Route ohne Lazy Loading
      {path: 'home', component: DashboardHomeComponent},
      {
        path: 'create-project',
        loadComponent: () => import('./dashboard/create-project/create-project.component').then(m => m.CreateProjectComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.PO , UserRole.Bereichsleiter]}
      },
      {
        path: 'team-roadmap',
        loadComponent: () => import('./dashboard/my-team-roadmap/my-team-roadmap.component').then(m => m.MyTeamRoadmapComponent)
      },
      {
        path: 'more-information',
        loadComponent: () => import('./dashboard/dashboard-home/more-information/more-information.component').then(m => m.MoreInformationComponent)
      },
      {
        path: 'admin-panel',
        loadComponent: () => import('./dashboard/admin-panel/admin-panel.component').then(m => m.AdminPanelComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin] }
      },
      {
        path: 'admin-panel/mitarbeiter-form',
        loadComponent: () => import('./dashboard/admin-panel/mitarbeiter-form/mitarbeiter-form.component').then(m => m.MitarbeiterFormComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin] }
      },
      {
        path: 'admin-panel/teams-form',
        loadComponent: () => import('./dashboard/admin-panel/teams-form/teams-form.component').then(m => m.TeamsFormComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin] }
      },
      {
        path: 'analyse-board',
        loadComponent: () => import('./dashboard/analyse-board/analyse-board.component').then(m => m.AnalyseBoardComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.SM] }
      },
      {
        path: 'team-overview',
        loadComponent: () => import('./dashboard/team-overview/team-overview.component').then(m => m.TeamOverviewComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.SM, UserRole.Admin, UserRole.Bereichsleiter ]}
      },
      {
        path: 'unauthorized',
        loadComponent: () => import('./unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
      },
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
