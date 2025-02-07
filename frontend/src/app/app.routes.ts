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
    data: { role: [UserRole.SM, UserRole.PO, UserRole.Developer, UserRole.Bereichsleiter, UserRole.Admin]},
    children: [
      {path: '', component: DashboardHomeComponent}, // Diese Route ohne Lazy Loading
      {path: 'home', component: DashboardHomeComponent,
        canActivate: [AuthGuard],
        data: { role: [UserRole.SM, UserRole.PO, UserRole.Developer, UserRole.Bereichsleiter,]},
      },
      {
        path: 'create-project',
        loadComponent: () => import('./dashboard/create-project/create-project.component').then(m => m.CreateProjectComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.PO , UserRole.Bereichsleiter]}
      },
      {
        path: 'team-roadmap',
        loadComponent: () => import('./dashboard/my-team-roadmap/my-team-roadmap.component').then(m => m.MyTeamRoadmapComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.PO, UserRole.SM, UserRole.Developer]}
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
        path: 'admin-panel/mitarbeiter-delete',
        loadComponent: () => import('./dashboard/admin-panel/mitarbeiter-delete/mitarbeiter-delete.component').then(m => m.MitarbeiterDeleteComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin] }
      },
      {
        path: 'admin-panel/teams-delete',
        loadComponent: () => import('./dashboard/admin-panel/team-delete/team-delete.component').then(m => m.TeamDeleteComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.Admin] }
      },
      {
        path: 'analyse-board',
        loadComponent: () => import('./dashboard/analyse-board/analyse-board.component').then(m => m.AnalyseBoardComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.SM, UserRole.Bereichsleiter] }
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
      {
        path: 'urlaubs-planung',
        loadComponent: () => import('./dashboard/urlaubs-planung/urlaubs-planung.component').then(m => m.UrlaubsPlanungComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.PO , UserRole.Developer, UserRole.SM, UserRole.Bereichsleiter]}
      },
      {
        path: 'urlaubs-overview',
        loadComponent: () => import('./dashboard/urlaub-overview/urlaub-overview.component').then(m => m.UrlaubOverviewComponent),
        canActivate: [AuthGuard],
        data: { role: [UserRole.Bereichsleiter]}
      },
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
