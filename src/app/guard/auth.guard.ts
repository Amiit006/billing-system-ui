// src/app/guards/auth.guard.ts - Fixed version
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    console.log('AuthGuard: Checking authentication for route:', state.url); // Debug log
    
    // Refresh auth state from localStorage
    this.authService.refreshAuthState();
    
    const currentUser = this.authService.currentUserValue;
    const isAuthenticated = this.authService.isAuthenticated();
    const isTokenExpired = this.authService.isTokenExpired();
    
    console.log('AuthGuard check:', { 
      currentUser: !!currentUser, 
      isAuthenticated, 
      isTokenExpired,
      url: state.url 
    }); // Debug log
    
    if (currentUser && isAuthenticated && !isTokenExpired) {
      console.log('AuthGuard: Access granted'); // Debug log
      return true;
    }

    console.log('AuthGuard: Access denied, redirecting to login'); // Debug log
    // Not logged in or token expired, redirect to login page
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}