import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { DashboardHomeComponent } from './dashboard-home/dashboard-home.component';

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
        ]
    },
    {   // Redirekt root to login page
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    }
];
