// src/app/app.component.ts - Fixed version
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from './services/auth.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'billing-sys-ui';
  showHeader = false;
  isAuthenticated = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    console.log('App Component initialized'); // Debug log
    
    // Refresh authentication state on app startup
    this.authService.refreshAuthState();
    
    // Subscribe to authentication state changes
    this.authService.currentUser.subscribe(user => {
      console.log('Auth state changed:', !!user); // Debug log
      this.isAuthenticated = !!user;
      this.updateHeaderVisibility();
    });

    // Subscribe to route changes to update header visibility
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      console.log('Route changed:', event.url); // Debug log
      this.updateHeaderVisibility();
    });

    // Initial header visibility check
    this.updateHeaderVisibility();
  }

  private updateHeaderVisibility(): void {
    const currentRoute = this.router.url;
    const isLoginPage = currentRoute.includes('/login');
    
    // Show header only if user is authenticated and not on login page
    this.showHeader = this.isAuthenticated && !isLoginPage;
    
    console.log('Header visibility:', { 
      currentRoute, 
      isLoginPage, 
      isAuthenticated: this.isAuthenticated, 
      showHeader: this.showHeader 
    }); // Debug log
  }
}