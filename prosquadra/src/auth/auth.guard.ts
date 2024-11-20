import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {UserRole} from '../types/user';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean> {
    const isAuthenticated = await this.authService.isAuthenticated();
    if (!isAuthenticated) {
      await this.router.navigate(['/login']);
      return false;
    }

    const requiredRole = route.data['role'] as UserRole;

    if (requiredRole) {
      const hasRole = await this.authService.hasRole(requiredRole);
      if (!hasRole) {
        await this.router.navigate(['dashboard/unauthorized']);
        return false;
      }
    }

    return true;
  }
}
